const { Layer, LayerSection } = require("../models");

exports.getAllLayers = async (req, res) => {
  try {

    const sections = await LayerSection.findAll({
      include: [
        {
          model: Layer,
          as: "layers",   
          attributes: [
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
            "opacity"
          ],
          order: [["sortby", "ASC"]]
        }
      ],
      order: [["section", "ASC"]]
    });

    const formattedData = sections.map(section => ({
      title: section.title,
      section: section.section,
      layers: section.layers.map(layer => ({   
        id: layer.layer_code,
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
        opacity: layer.opacity
      }))
    }));

    res.status(200).json({
      success: true,
      message: "Web Layers retrieved successfully.",
      data: formattedData
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};