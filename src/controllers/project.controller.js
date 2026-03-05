
const { Project, ProjectLayer, LayerTemplate, LayerSection } = require("../models");

// ---------- GET /api/projects  → list all projects ----------
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { is_active: true },
      attributes: ["id", "name", "code", "from_station", "to_station", "geoserver_workspace", "track_length_km","station_count"],
      order: [["id", "ASC"]]
    });

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully.",
      data: projects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ---------- GET /api/projects/:projectId/layers  → project layers grouped by section ----------
exports.getProjectLayers = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await Project.findOne({
      where: { id: projectId, is_active: true },
      attributes: ["id", "name", "code", "from_station", "to_station", "geoserver_workspace"]
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    // Fetch project layers → join template → join section
    const projectLayers = await ProjectLayer.findAll({
      where: { project_id: projectId },
      include: [
        {
          model: LayerTemplate,
          as: "template",
          attributes: [
            "layer_code", "name", "type",
            "color", "fillcolor", "opacity",
            "icon_url", "popup_type", "popup_name",
            "bind_popup_name", "popup_field_name", "sortby"
          ],
          include: [
            {
              model: LayerSection,
              attributes: ["id", "title", "section"]
            }
          ]
        }
      ],
      order: [
        [{ model: LayerTemplate, as: "template" }, "sortby", "ASC"]
      ]
    });

    // Group by section (same pattern as your existing getAllLayers)
    const sectionMap = {};

    projectLayers.forEach(pl => {
      const tmpl    = pl.template;
      const section = tmpl.LayerSection;

      if (!sectionMap[section.id]) {
        sectionMap[section.id] = {
          title:   section.title,
          section: section.section,
          layers:  []
        };
      }

      // COALESCE: use project override if set, else fall back to template default
      sectionMap[section.id].layers.push({
        id:               tmpl.layer_code,
        name:             tmpl.name,
        color:            pl.color        || tmpl.color,
        fillcolor:        pl.fillcolor    || tmpl.fillcolor,
        opacity:          pl.opacity      || tmpl.opacity,
        isenabled:        pl.isenabled,
        type:             tmpl.type,
        apiendpoint:      pl.apiendpoint,
        sortBy:           pl.sortby       || tmpl.sortby,
        popupType:        tmpl.popup_type,
        popupname:        tmpl.popup_name,
        bindPopupName:    tmpl.bind_popup_name,
        popupFieldName:   tmpl.popup_field_name,
        iconUrl:          tmpl.icon_url,
        geoserverWorkSpace: pl.geoserver_workspace || project.geoserver_workspace,
        geoserverLayer:   pl.geoserver_layer,
        // ready-to-use WMS URL for Leaflet
        wmsUrl: `${process.env.GEOSERVER_BASE_URL}/${pl.geoserver_workspace || project.geoserver_workspace}/wms`
      });
    });

    // Sort sections by section number
    const formattedData = Object.values(sectionMap).sort((a, b) => a.section - b.section);

    res.status(200).json({
      success: true,
      message: "Project layers retrieved successfully.",
      data: {
        project: {
          id:           project.id,
          name:         project.name,
          code:         project.code,
          from_station: project.from_station,
          to_station:   project.to_station
        },
        sections: formattedData
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ---------- PATCH /api/projects/:projectId/layers/:layerCode  → toggle enable ----------
exports.toggleProjectLayer = async (req, res) => {
  try {
    const { projectId, layerCode } = req.params;
    const { isenabled } = req.body;

    const template = await LayerTemplate.findOne({ where: { layer_code: layerCode } });
    if (!template) return res.status(404).json({ success: false, message: "Layer not found." });

    const [updated] = await ProjectLayer.update(
      { isenabled },
      { where: { project_id: projectId, layer_template_id: template.id } }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Project layer not found." });

    res.status(200).json({ success: true, message: "Layer updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};