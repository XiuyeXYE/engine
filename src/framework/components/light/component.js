pc.extend(pc, function () {
    /**
     * @component
     * @constructor
     * @name pc.LightComponent
     * @classdesc The Light Component enables the Entity to light the scene. There are three types
     * of light: directional, point and spot. Directional lights are global in that they are
     * considered to be infinitely far away and light the entire scene. Point and spot lights
     * are local in that they have a position and a range. A spot light is a specialization of
     * a point light where light is emitted in a cone rather than in all directions. Lights
     * also have the ability to cast shadows to add realism to your scenes.
     * @description Creates a new Light Component.
     * @param {pc.LightComponentSystem} system The ComponentSystem that created this Component.
     * @param {pc.Entity} entity The Entity that this Component is attached to.
     * @example
     * // Add a pc.LightComponent to an entity
     * var entity = new pc.Entity();
     * entity.addComponent('light', {
     *     type: "point",
     *     color: new pc.Color(1, 0, 0),
     *     range: 10
     * });
     * @example
     * // Get the pc.LightComponent on an entity
     * var lightComponent = entity.light;
     * @example
     * // Update a property on a light component
     * entity.light.range = 20;
     * @property {String} type The type of light. Can be:
     * <ul>
     *     <li>"directional": A light that is infinitely far away and lights the entire scene from one direction.</li>
     *     <li>"point": A light that illuminates in all directions from a point.</li>
     *     <li>"spot": A light that illuminates in all directions from a point and is bounded by a cone.</li>
     * </ul>
     * Defaults to "directional".
     * @property {pc.Color} color The Color of the light. The alpha component of the color is
     * ignored. Defaults to white (1, 1, 1).
     * @property {Number} intensity The brightness of the light. Defaults to 1.
     * @property {Boolean} castShadows If enabled the light will cast shadows. Defaults to false.
     * @property {Number} shadowDistance The distance from the viewpoint beyond which shadows
     * are no longer rendered. Affects directional lights only. Defaults to 40.
     * @property {Number} shadowResolution The size of the texture used for the shadow map.
     * Valid sizes are 64, 128, 256, 512, 1024, 2048. Defaults to 1024.
     * @property {Number} shadowBias The depth bias for tuning the appearance of the shadow
     * mapping generated by this light. Defaults to 0.05.
     * @property {Number} normalOffsetBias Normal offset depth bias. Defaults to 0.
     * @property {Number} range The range of the light. Affects point and spot lights only.
     * Defaults to 10.
     * @property {Number} innerConeAngle The angle at which the spotlight cone starts
     * to fade off. The angle is specified in degrees. Affects spot lights only. Defaults
     * to 40.
     * @property {Number} outerConeAngle The angle at which the spotlight cone has faded
     * to nothing. The angle is specified in degrees. Affects spot lights only. Defaults
     * to 45.
     * @property {Number} falloffMode Controls the rate at which a light attentuates from
     * its position. Can be:
     * <ul>
     * <li>{@link pc.LIGHTFALLOFF_LINEAR}: Linear.</li>
     * <li>{@link pc.LIGHTFALLOFF_INVERSESQUARED}: Inverse squared.</li>
     * </ul>
     * Affects point and spot lights only. Defaults to pc.LIGHTFALLOFF_LINEAR.
     * @property {Number} mask Defines a mask to determine which {@link pc.MeshInstance}s are
     * lit by this light. Defaults to 1.
     * @property {Boolean} affectDynamic If enabled the light will affect non-lightmapped objects
     * @property {Boolean} affectLightmapped If enabled the light will affect lightmapped objects
     * @property {Boolean} bake If enabled the light will be rendered into lightmaps
     * @property {Boolean} bakeDir If enabled and bake=true, the light's direction will contribute to directional lightmaps.
     * Be aware, that directional lightmap is an approximation and can only hold single direction per pixel.
     * Intersecting multiple lights with bakeDir=true may lead to incorrect look of specular/bump-mapping in the area of intersection.
     * The error is not always visible though, and highly scene-dependent.
     * @property {Number} shadowUpdateMode Tells the renderer how often shadows must be updated for this light. Options:
     * <ul>
     * <li>{@link pc.SHADOWUPDATE_NONE}: Don't render shadows.</li>
     * <li>{@link pc.SHADOWUPDATE_THISFRAME}: Render shadows only once (then automatically switches to pc.SHADOWUPDATE_NONE).</li>
     * <li>{@link pc.SHADOWUPDATE_REALTIME}: Render shadows every frame (default).</li>
     * </ul>
     * @property {Number} shadowType Type of shadows being rendered by this light. Options:
     * <ul>
     * <li>{@link pc.SHADOW_PCF3}: Render depth (color-packed on WebGL 1.0), can be used for PCF 3x3 sampling.</li>
     * <li>{@link pc.SHADOW_VSM8}: Render packed variance shadow map. All shadow receivers must also cast shadows for this mode to work correctly.</li>
     * <li>{@link pc.SHADOW_VSM16}: Render 16-bit exponential variance shadow map. Requires OES_texture_half_float extension. Falls back to pc.SHADOW_VSM8, if not supported.</li>
     * <li>{@link pc.SHADOW_VSM32}: Render 32-bit exponential variance shadow map. Requires OES_texture_float extension. Falls back to pc.SHADOW_VSM16, if not supported.</li>
     * <li>{@link pc.SHADOW_PCF5}: Render depth buffer only, can be used for hardware-accelerated PCF 5x5 sampling. Requires WebGL2. Falls back to pc.SHADOW_PCF3 on WebGL 1.0.</li>
     * </ul>
     * @property {Number} vsmBlurMode Blurring mode for variance shadow maps:
     * <ul>
     * <li>{@link pc.BLUR_BOX}: Box filter.</li>
     * <li>{@link pc.BLUR_GAUSSIAN}: Gaussian filter. May look smoother than box, but requires more samples.</li>
     * </ul>
     * @property {Number} vsmBlurSize Number of samples used for blurring a variance shadow map. Only uneven numbers work, even are incremented. Minimum value is 1, maximum is 25.
     * @property {Number} cookieAsset Asset that has texture that will be assigned to cookie internally once asset resource is available.
     * @property {pc.Texture} cookie Projection texture. Must be 2D for spot and cubemap for point (ignored if incorrect type is used).
     * @property {Number} cookieIntensity Projection texture intensity (default is 1).
     * @property {Boolean} cookieFalloff Toggle normal spotlight falloff when projection texture is used. When set to false, spotlight will work like a pure texture projector (only fading with distance). Default is false.
     * @property {String} cookieChannel Color channels of the projection texture to use. Can be "r", "g", "b", "a", "rgb" or any swizzled combination.
     * @property {Number} cookieAngle Angle for spotlight cookie rotation.
     * @property {pc.Vec2} cookieScale Spotlight cookie scale.
     * @property {pc.Vec2} cookieOffset Spotlight cookie position offset.
     * @property {Boolean} isStatic Mark light as non-movable (optimization)
     * @property {Array} layers An array of layer IDs ({@link pc.Layer#id}) to which this light should belong.
     * Don't push/pop/splice or modify this array, if you want to change it - set a new one instead.
     * @extends pc.Component
     */
    var LightComponent = function LightComponent(system, entity) {
        this._cookieAsset = null;
        this._cookieAssetId = null;
        this._cookieAssetAdd = false;
        this._cookieMatrix = null;
    };
    LightComponent = pc.inherits(LightComponent, pc.Component);

    var _props = [];
    var _propsDefault = [];

    var _defineProperty = function (name, defaultValue, setFunc, skipEqualsCheck) {
        var c = LightComponent.prototype;
        _props.push(name);
        _propsDefault.push(defaultValue);

        Object.defineProperty(c, name, {
            get: function () {
                return this.data[name];
            },
            set: function (value) {
                var data = this.data;
                var oldValue = data[name];
                if (! skipEqualsCheck && oldValue === value) return;
                data[name] = value;
                if (setFunc) setFunc.call(this, value, oldValue);
            },
            configurable: true
        });
    };

    var _defineProps = function () {
        _defineProperty("enabled", true, function (newValue, oldValue) {
            this.onSetEnabled(null, oldValue, newValue);
        });
        _defineProperty("light", null);
        _defineProperty("type", 'directional', function (newValue, oldValue) {
            this.system.changeType(this, oldValue, newValue);
            /*
             * refresh light properties because changing the type does not reset the
             * light properties
             */
            this.refreshProperties();
        });
        _defineProperty("color", new pc.Color(1, 1, 1), function (newValue, oldValue) {
            this.light.setColor(newValue);
        }, true);
        _defineProperty("intensity", 1, function (newValue, oldValue) {
            this.light.intensity = newValue;
        });
        _defineProperty("castShadows", false, function (newValue, oldValue) {
            this.light.castShadows = newValue;
        });
        _defineProperty("shadowDistance", 40, function (newValue, oldValue) {
            this.light.shadowDistance = newValue;
        });
        _defineProperty("shadowResolution", 1024, function (newValue, oldValue) {
            this.light.shadowResolution = newValue;
        });
        _defineProperty("shadowBias", 0.05, function (newValue, oldValue) {
            this.light.shadowBias = -0.01 * newValue;
        });
        _defineProperty("normalOffsetBias", 0, function (newValue, oldValue) {
            this.light.normalOffsetBias = newValue;
        });
        _defineProperty("range", 10, function (newValue, oldValue) {
            this.light.attenuationEnd = newValue;
        });
        _defineProperty("innerConeAngle", 40, function (newValue, oldValue) {
            this.light.innerConeAngle = newValue;
        });
        _defineProperty("outerConeAngle", 45, function (newValue, oldValue) {
            this.light.outerConeAngle = newValue;
        });
        _defineProperty("falloffMode", pc.LIGHTFALLOFF_LINEAR, function (newValue, oldValue) {
            this.light.falloffMode = newValue;
        });
        _defineProperty("shadowType", pc.SHADOW_PCF3, function (newValue, oldValue) {
            this.light.shadowType = newValue;
        });
        _defineProperty("vsmBlurSize", 11, function (newValue, oldValue) {
            this.light.vsmBlurSize = newValue;
        });
        _defineProperty("vsmBlurMode", pc.BLUR_GAUSSIAN, function (newValue, oldValue) {
            this.light.vsmBlurMode = newValue;
        });
        _defineProperty("vsmBias", 0.01 * 0.25, function (newValue, oldValue) {
            this.light.vsmBias = newValue;
        });
        _defineProperty("cookieAsset", null, function (newValue, oldValue) {
            if (this._cookieAssetId && ((newValue instanceof pc.Asset && newValue.id === this._cookieAssetId) || newValue === this._cookieAssetId))
                return;

            this.onCookieAssetRemove();
            this._cookieAssetId = null;

            if (newValue instanceof pc.Asset) {
                this.data.cookieAsset = newValue.id;
                this._cookieAssetId = newValue.id;
                this.onCookieAssetAdd(newValue);
            } else if (typeof(newValue) === 'number') {
                this._cookieAssetId = newValue;
                var asset = this.system.app.assets.get(newValue);
                if (asset) {
                    this.onCookieAssetAdd(asset);
                } else {
                    this._cookieAssetAdd = true;
                    this.system.app.assets.on('add:' + this._cookieAssetId, this.onCookieAssetAdd, this);
                }
            }
        });
        _defineProperty("cookie", null, function (newValue, oldValue) {
            this.light.cookie = newValue;
        });
        _defineProperty("cookieIntensity", 1, function (newValue, oldValue) {
            this.light.cookieIntensity = newValue;
        });
        _defineProperty("cookieFalloff", true, function (newValue, oldValue) {
            this.light.cookieFalloff = newValue;
        });
        _defineProperty("cookieChannel", "rgb", function (newValue, oldValue) {
            this.light.cookieChannel = newValue;
        });
        _defineProperty("cookieAngle", 0, function (newValue, oldValue) {
            if (newValue !== 0 || this.cookieScale !== null) {
                if (!this._cookieMatrix) this._cookieMatrix = new pc.Vec4();
                var scx = 1;
                var scy = 1;
                if (this.cookieScale) {
                    scx = this.cookieScale.x;
                    scy = this.cookieScale.y;
                }
                var c = Math.cos(newValue * pc.math.DEG_TO_RAD);
                var s = Math.sin(newValue * pc.math.DEG_TO_RAD);
                this._cookieMatrix.set(c / scx, -s / scx, s / scy, c / scy);
                this.light.cookieTransform = this._cookieMatrix;
            } else {
                this.light.cookieTransform = null;
            }
        });
        _defineProperty("cookieScale", null, function (newValue, oldValue) {
            if (newValue !== null || this.cookieAngle !== 0) {
                if (!this._cookieMatrix) this._cookieMatrix = new pc.Vec4();
                var scx = newValue.x;
                var scy = newValue.y;
                var c = Math.cos(this.cookieAngle * pc.math.DEG_TO_RAD);
                var s = Math.sin(this.cookieAngle * pc.math.DEG_TO_RAD);
                this._cookieMatrix.set(c / scx, -s / scx, s / scy, c / scy);
                this.light.cookieTransform = this._cookieMatrix;
            } else {
                this.light.cookieTransform = null;
            }
        }, true);
        _defineProperty("cookieOffset", null, function (newValue, oldValue) {
            this.light.cookieOffset = newValue;
        }, true);
        _defineProperty("shadowUpdateMode", pc.SHADOWUPDATE_REALTIME, function (newValue, oldValue) {
            this.light.shadowUpdateMode = newValue;
        });
        _defineProperty("mask", 1, function (newValue, oldValue) {
            this.light.mask = newValue;
        });
        _defineProperty("affectDynamic", true, function (newValue, oldValue) {
            if (newValue) {
                this.light.mask |= pc.MASK_DYNAMIC;
            } else {
                this.light.mask &= ~pc.MASK_DYNAMIC;
            }
            this.light.mask = this.light._mask;
        });
        _defineProperty("affectLightmapped", false, function (newValue, oldValue) {
            if (newValue) {
                this.light.mask |= pc.MASK_BAKED;
                if (this.bake) this.light.mask &= ~pc.MASK_LIGHTMAP;
            } else {
                this.light.mask &= ~pc.MASK_BAKED;
                if (this.bake) this.light.mask |= pc.MASK_LIGHTMAP;
            }
            this.light.mask = this.light._mask;
        });
        _defineProperty("bake", false, function (newValue, oldValue) {
            if (newValue) {
                this.light.mask |= pc.MASK_LIGHTMAP;
                if (this.affectLightmapped) this.light.mask &= ~pc.MASK_BAKED;
            } else {
                this.light.mask &= ~pc.MASK_LIGHTMAP;
                if (this.affectLightmapped) this.light.mask |= pc.MASK_BAKED;
            }
            this.light.mask = this.light._mask;
        });
        _defineProperty("bakeDir", true, function (newValue, oldValue) {
            this.light.bakeDir = newValue;
        });
        _defineProperty("isStatic", false, function (newValue, oldValue) {
            this.light.isStatic = newValue;
        });
        _defineProperty("layers", [pc.LAYERID_WORLD], function (newValue, oldValue) {
            var i, layer;
            for (i = 0; i < oldValue.length; i++) {
                layer = this.system.app.scene.layers.getLayerById(oldValue[i]);
                if (!layer) continue;
                layer.removeLight(this);
            }
            for (i = 0; i < newValue.length; i++) {
                layer = this.system.app.scene.layers.getLayerById(newValue[i]);
                if (!layer) continue;
                if (this.enabled && this.entity.enabled) {
                    layer.addLight(this);
                }
            }
        });
    };
    _defineProps();


    Object.defineProperty(LightComponent.prototype, "enable", {
        get: function () {
            console.warn("WARNING: enable: Property is deprecated. Query enabled property instead.");
            return this.enabled;
        },
        set: function (value) {
            console.warn("WARNING: enable: Property is deprecated. Set enabled property instead.");
            this.enabled = value;
        }
    });

    pc.extend(LightComponent.prototype, {

        addLightToLayers: function () {
            var layer;
            for (var i = 0; i < this.layers.length; i++) {
                layer = this.system.app.scene.layers.getLayerById(this.layers[i]);
                if (!layer) continue;
                layer.addLight(this);
            }
        },

        removeLightFromLayers: function () {
            var layer;
            for (var i = 0; i < this.layers.length; i++) {
                layer = this.system.app.scene.layers.getLayerById(this.layers[i]);
                if (!layer) continue;
                layer.removeLight(this);
            }
        },

        onLayersChanged: function (oldComp, newComp) {
            if (this.enabled && this.entity.enabled) {
                this.addLightToLayers();
            }
            oldComp.off("add", this.onLayerAdded, this);
            oldComp.off("remove", this.onLayerRemoved, this);
            newComp.on("add", this.onLayerAdded, this);
            newComp.on("remove", this.onLayerRemoved, this);
        },

        onLayerAdded: function (layer) {
            var index = this.layers.indexOf(layer.id);
            if (index < 0) return;
            if (this.enabled && this.entity.enabled) {
                layer.addLight(this);
            }
        },

        onLayerRemoved: function (layer) {
            var index = this.layers.indexOf(layer.id);
            if (index < 0) return;
            layer.removeLight(this);
        },

        refreshProperties: function () {
            var name;
            for (var i = 0; i < _props.length; i++) {
                name = _props[i];
                this[name] = this[name];
            }
            if (this.enabled && this.entity.enabled)
                this.onEnable();
        },

        updateShadow: function () {
            this.light.updateShadow();
        },

        onCookieAssetSet: function () {
            var forceLoad = false;

            if (this._cookieAsset.type === 'cubemap' && ! this._cookieAsset.loadFaces) {
                this._cookieAsset.loadFaces = true;
                forceLoad = true;
            }

            if (! this._cookieAsset.resource || forceLoad)
                this.system.app.assets.load(this._cookieAsset);

            if (this._cookieAsset.resource)
                this.onCookieAssetLoad();
        },

        onCookieAssetAdd: function (asset) {
            if (this._cookieAssetId !== asset.id)
                return;

            this._cookieAsset = asset;

            if (this.light._enabled)
                this.onCookieAssetSet();

            this._cookieAsset.on('load', this.onCookieAssetLoad, this);
            this._cookieAsset.on('remove', this.onCookieAssetRemove, this);
        },

        onCookieAssetLoad: function () {
            if (! this._cookieAsset || ! this._cookieAsset.resource)
                return;

            this.cookie = this._cookieAsset.resource;
        },

        onCookieAssetRemove: function () {
            if (! this._cookieAssetId)
                return;

            if (this._cookieAssetAdd) {
                this.system.app.assets.off('add:' + this._cookieAssetId, this.onCookieAssetAdd, this);
                this._cookieAssetAdd = false;
            }

            if (this._cookieAsset) {
                this._cookieAsset.off('load', this.onCookieAssetLoad, this);
                this._cookieAsset.off('remove', this.onCookieAssetRemove, this);
                this._cookieAsset = null;
            }

            this.cookie = null;
        },

        onEnable: function () {
            LightComponent._super.onEnable.call(this);
            this.light.enabled = true;

            this.system.app.scene.on("set:layers", this.onLayersChanged, this);
            if (this.system.app.scene.layers) {
                this.system.app.scene.layers.on("add", this.onLayerAdded, this);
                this.system.app.scene.layers.on("remove", this.onLayerRemoved, this);
            }

            if (this.enabled && this.entity.enabled) {
                this.addLightToLayers();
            }

            if (this._cookieAsset && ! this.cookie)
                this.onCookieAssetSet();
        },

        onDisable: function () {
            LightComponent._super.onDisable.call(this);
            this.light.enabled = false;

            this.system.app.scene.off("set:layers", this.onLayersChanged, this);
            if (this.system.app.scene.layers) {
                this.system.app.scene.layers.off("add", this.onLayerAdded, this);
                this.system.app.scene.layers.off("remove", this.onLayerRemoved, this);
            }

            this.removeLightFromLayers();
        }

    });

    return {
        LightComponent: LightComponent,
        _lightProps: _props,
        _lightPropsDefault: _propsDefault
    };
}());
