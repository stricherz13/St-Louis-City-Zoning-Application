var map = L.map('map').setView([38.647003, -90.199402], 12);

const apiKey = "AAPK04f41e8ef372436dba3d95a5b61160ebiArS2bjH0-ucYo1Nn63tx1BN34a1C4Gevi5-FwqZmJObDWFNnPw2X_2AezIyZuf9";

const basemapLayers = {

    OSM: L.esri.Vector.vectorBasemapLayer("OSM:Standard", {apiKey: apiKey}).addTo(map),
    "OSM:Streets": L.esri.Vector.vectorBasemapLayer("OSM:Streets", {apiKey: apiKey}),
    Streets: L.esri.Vector.vectorBasemapLayer("ArcGIS:Streets", {apiKey: apiKey}),
    Navigation: L.esri.Vector.vectorBasemapLayer("ArcGIS:Navigation", {apiKey: apiKey}),
    Topographic: L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic", {apiKey: apiKey}),
    "Light Gray": L.esri.Vector.vectorBasemapLayer("ArcGIS:LightGray", {apiKey: apiKey}),
    "Dark gray": L.esri.Vector.vectorBasemapLayer("ArcGIS:DarkGray", {apiKey: apiKey}),
    "Streets Relief": L.esri.Vector.vectorBasemapLayer("ArcGIS:StreetsRelief", {apiKey: apiKey}),
    Imagery: L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery", {apiKey: apiKey}),
    ChartedTerritory: L.esri.Vector.vectorBasemapLayer("ArcGIS:ChartedTerritory", {apiKey: apiKey}),
    ColoredPencil: L.esri.Vector.vectorBasemapLayer("ArcGIS:ColoredPencil", {apiKey: apiKey}),
    Nova: L.esri.Vector.vectorBasemapLayer("ArcGIS:Nova", {apiKey: apiKey}),
    Midcentury: L.esri.Vector.vectorBasemapLayer("ArcGIS:Midcentury", {apiKey: apiKey})
};

L.control.layers(basemapLayers, null, {collapsed: false}).addTo(map);

L.Control.QueryControl = L.Control.extend({
    onAdd: function (map) {
        const whereClauses = [
            "Choose a Zoning Type",
            "zoning = 'Area Commercial'",
            "zoning = 'Central Business District'",
            "zoning = 'Industrial'",
            "zoning = 'Jefferson Memorial District'",
            "zoning = 'Local Commercial and Office'",
            "zoning = 'Multiple Family Residential'",
            "zoning = 'Neighborhood Commercial'",
            "zoning = 'Not Zoned'",
            "zoning = 'Single Family Residential'",
            "zoning = 'Two Family Residential'",
            "zoning = 'Unrestricted'"
        ];

        const select = L.DomUtil.create("select", "");
        select.setAttribute("id", "whereClauseSelect");
        select.setAttribute("style", "font-size: 16px;padding:4px 8px;");
        whereClauses.forEach(function (whereClause) {
            let option = L.DomUtil.create("option");
            option.innerHTML = whereClause;
            select.appendChild(option);
        });
        return select;

    },

    onRemove: function (map) {
        // Nothing to do here
    }
});

L.control.queryControl = function (opts) {
    return new L.Control.QueryControl(opts);
};

L.control
    .queryControl({
        position: "topleft"
    })
    .addTo(map);

const parcels = L.esri
    .featureLayer({
        url: "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/St_Louis_Parcels/FeatureServer/0",
        // simplifyFactor: 0.5,
        // precision: 4,

        where: "1 = 0"
    })
    .addTo(map);

const select = document.getElementById("whereClauseSelect");
select.addEventListener("change", () => {
    if (select.value !== "") {
        parcels.setWhere(select.value);
    }
});

parcels.bindPopup(function (layer) {
    return L.Util.template("<b> Handle: {HANDLE} </b><br>" + "Zone: {zoning} <br>"+ "Address: {SITEADDR} <br>" + "Landuse: {landuse} <br>" + "Neighborhood: {neighborho} <br>", layer.feature.properties);
});
