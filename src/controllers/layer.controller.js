const { Layer, LayerSection } = require("../models");

const { Op } = require("sequelize");
exports.getAllLayers = async (req, res) => {
  try {

    const { project_id } = req.query;

    let layerWhere = {
      isactivated: true
    };

    if (project_id) {
      const projectIds = project_id
        .split(",")
        .map(id => parseInt(id.trim()))
        .filter(Boolean);

      layerWhere = {
        isactivated: true,
        [Op.or]: [
          { project_id: { [Op.in]: projectIds } },  
          { section_id: 3, project_id: null }        
        ]
      };
    }

    const sections = await LayerSection.findAll({
      include: [
        {
          model: Layer,
          as: "layers",
          where: layerWhere,
          required: false,
          attributes: [
            "id",
            "layer_code",
            "name",
            "color",
            "fillcolor",
            "isenabled",
            "type",
            "apiendpoint",
            "sortby",
            "popup_type",
            "popup_name",
            "bind_popup_name",
            "popup_field_name",
            "icon_url",
            "geoserver_workspace",
            "opacity",
            "project_id",
            "section_id",
            "project_id"
          ]
        }
      ],
      order: [["section", "ASC"]]
    });

    const formattedData = sections.map(section => ({
      title: section.title,
      section: section.section,
      layers: section.layers
        .sort((a, b) => (a.sortby || 0) - (b.sortby || 0))
        .map(layer => ({
          id: layer.id,
          layerCode :layer.layer_code,
          name: layer.name,
          color: layer.color,
          fillcolor: layer.fillcolor,
          isenabled: layer.isenabled,
          type: layer.type,
          apiendpoint: layer.apiendpoint,
          sortBy: layer.sortby,
          popupType: layer.popup_type,
          popupname: layer.popup_name,
          bindPopupName: layer.bind_popup_name,
          popupFieldName: layer.popup_field_name,
          iconUrl: layer.icon_url,
          geoserverWorkSpace: layer.geoserver_workspace,
          opacity: layer.opacity,
          project_id :layer.project_id
        }))
    }));

    res.status(200).json({
      success: true,
      message: "Layers retrieved successfully.",
      data: formattedData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
/* ======================================================
   CREATE LAYER
   POST /api/layers
====================================================== */

exports.createLayer = async (req, res) => {
  try {
    const {
      project_id,
      section_id,
      layer_code,
      name,
      color,
      fillcolor,
      opacity,
      isenabled,
      type,
      apiendpoint,
      sortby,
      popup_type,
      popup_name,
      bind_popup_name,
      popup_field_name,
      icon_url,
      geoserver_workspace
    } = req.body;

    const existingLayer = await Layer.findOne({
      where: { layer_code }
    });

    if (existingLayer) {
      return res.status(400).json({
        success: false,
        message: "Layer code already exists"
      });
    }

    const layer = await Layer.create({
      project_id,
      section_id,
      layer_code,
      name,
      color,
      fillcolor,
      opacity,
      isenabled,
      type,
      apiendpoint,
      sortby,
      popup_type,
      popup_name,
      bind_popup_name,
      popup_field_name,
      icon_url,
      geoserver_workspace
    });

    res.status(201).json({
      success: true,
      message: "Layer created successfully",
      data: layer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create layer",
      error: error.message
    });
  }
};


/* ======================================================
   UPDATE LAYER
   PUT /api/layers/:layerId
====================================================== */

exports.updateLayer = async (req, res) => {
  try {
    const { layerId } = req.params;

    const layer = await Layer.findByPk(layerId);

    if (!layer) {
      return res.status(404).json({
        success: false,
        message: "Layer not found"
      });
    }

    await layer.update(req.body);

    res.status(200).json({
      success: true,
      message: "Layer updated successfully",
      data: layer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update layer",
      error: error.message
    });
  }
};


exports.softDeleteLayer = async (req, res) => {
  try {

    const { layerId } = req.params;

    const layer = await Layer.findByPk(layerId);

    if (!layer) {
      return res.status(404).json({
        success: false,
        message: "Layer not found"
      });
    }

    await layer.update({
      isactivated: false
    });

    res.status(200).json({
      success: true,
      message: "Layer deleted successfully (soft delete)"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.restoreLayer = async (req, res) => {
  try {

    const { layerId } = req.params;

    await Layer.update(
      { isactivated: true },
      { where: { id: layerId } }
    );

    res.status(200).json({
      success: true,
      message: "Layer restored successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};