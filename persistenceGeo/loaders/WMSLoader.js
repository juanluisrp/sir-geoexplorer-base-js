/*
 * WMSLoader.js Copyright (C) 2012 This file is part of PersistenceGeo project
 *
 * This software is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * As a special exception, if you link this library with other files to
 * produce an executable, this library does not by itself cause the
 * resulting executable to be covered by the GNU General Public License.
 * This exception does not however invalidate any other reasons why the
 * executable file might be covered by the GNU General Public License.
 *
 * Authors: Alejandro Diaz Torres (mailto:adiaz@emergya.com)
 */

/**
 * api: (define) module = PersistenceGeo
 */
Ext.namespace("PersistenceGeo.loaders");

/**
 * api: (define) module = PersistenceGeo.loaders class = WMSLoader
 */
Ext.namespace("PersistenceGeo.loaders.WMSLoader");

/**
 * Class: PersistenceGeo.WMSLoader
 *
 * Loader for WMS Layers
 *
 */
PersistenceGeo.loaders.WMSLoader = Ext.extend(
PersistenceGeo.loaders.AbstractLoader, {

    load: function(layerData, layerTree) {
        var visibility = false;
        var transparent = true;
        var isBaseLayer = false;
        var opacity = 1;
        var buffer = 1;
        var format = 'image/png';
        var layers = layerData.name;
        var layerTitle = layerData.layerTitle;
        var authId = layerData.authId;

        if (!layerTitle) {
            // if no layerTitle use layer name without workspace
            // component
            var layerComponents = layerData.name.split(':');
            if (layerComponents.length > 1) {
                layerTitle = layerComponents[1].replace(/_/g, " ");
            } else {
                layerTitle = layerData.name;
            }
        }



        if ( !! layerData.properties) {
            visibility = this.toBoolean(layerData.properties.visibility) || false;
            transparent = this.toBoolean(layerData.properties.transparent) || true;
            isBaseLayer = this.toBoolean(layerData.properties.isBaseLayer) || false;
            opacity = this.toNumber(layerData.properties.opacity) || opacity;
            buffer = this.toNumber(layerData.properties.buffer) || buffer;

            format = layerData.properties.format || format;
            layers = layerData.properties.layers || layers;

            if(layerData.properties.tiled) {
                options.tiled = this.toBoolean(layerData.properties.tiled) || false;
            }
        }
           var options = {
            layers: layers,
            transparent: transparent
        };

        var layer = new OpenLayers.Layer.WMS(layerTitle,
        layerData.server_resource, options, {
            format: format,
            isBaseLayer: isBaseLayer,
            visibility: visibility,
            opacity: opacity,
            buffer: buffer,
            authId: authId

        });

        layer.metadata = {
            layerTypeId: layerData.typeId
        };


        // TODO: Wrap
        this.postFunctionsWrapper(layerData, layer, layerTree);

        return layer;
    }
});
