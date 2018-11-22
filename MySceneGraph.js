/**
 * MySceneGraph
 * @constructor
 */

var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor Constructor of the class MySceneGraph
     * @param {xml file name} filename
     * @param {scene of the application} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.currMaterial = 0;

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse primitives block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <scene> block.
     * @param {XML scene node} sceneNode
     */
    parseScene(sceneNode) {
        var root = this.reader.getString(sceneNode, 'root');
        if (root == null || root == "") {
            root = 1;
            return "Root length can't be null.";
        }

        var axisLength = this.reader.getFloat(sceneNode, 'axis_length');
        if (axisLength == null || isNaN(axisLength)) {
            axisLength = 1;
            return "Axis length can't be null.";
        }

        if (axisLength <= 0) {
            axisLength = 1;
            return "Axis length is too small.";
        }

        this.idRoot = root;
        this.axisLength = axisLength;
    }

    /**
     * Parses the <views> block.
     * @param {XML views node} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;

        this.views = [];
        this.views.cameras = [];

        var defaultCam = this.reader.getString(viewsNode, 'default');
        if (defaultCam == null || defaultCam == "") {
            return "Default element must not be null.";
        }

        this.views.currCam = defaultCam;

        if (children.length < 1) {
            return "At least one camera must be defined.";
        }

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var camera = [];
            var id;

            id = this.reader.getString(children[i], 'id');
            if (id == null || id == "") {
                id = "perspective";
                return "Id element must not be null.";
            }

            if(this.views[id] != null) {
                return "Id element must be unique for each view. (Duplicate: "+ id + ")";
            }

            if (children[i].nodeName == "perspective") {
                var near, far, angle;

                near = this.reader.getFloat(children[i], 'near');
                if (near == null || isNaN(near)) {
                    near = 1;
                    return "Near element must not be null.";
                }

                far = this.reader.getFloat(children[i], 'far');
                if (far == null || isNaN(far)) {
                    far = 10;
                    return "Far element must not be null.";
                }
                else if (near >= far)
                    return '"near" must be smaller than "far"';

                angle = this.reader.getFloat(children[i], 'angle');
                if (angle == null || isNaN(angle)) {
                    angle = 0;
                    return "Angle element must not be null.";
                }

                var range = children[i].children;

                var rangeNames = [];

                for (var j = 0; j < range.length; j++)
                    rangeNames.push(range[j].nodeName);

                if (children[i].getElementsByTagName('from').length != 1)
                    return 'one and only one "from" tag must be defined';

                if (children[i].getElementsByTagName('to').length != 1)
                    return 'one and only one "to" tag must be defined';

                var indexFrom = rangeNames.indexOf("from");
                var indexTo = rangeNames.indexOf("to");

                var fromX = this.reader.getFloat(range[indexFrom], 'x');
                var fromY = this.reader.getFloat(range[indexFrom], 'y');
                var fromZ = this.reader.getFloat(range[indexFrom], 'z');
                var fromVec = vec3.fromValues(fromX,fromY,fromZ);

                if (fromX == null || fromY == null || fromZ == null || isNaN(fromX) || isNaN(fromY) || isNaN(fromZ)) {
                    return "x, y and z can't be null.";
                }

                var toX = this.reader.getFloat(range[indexTo], 'x');
                var toY = this.reader.getFloat(range[indexTo], 'y');
                var toZ = this.reader.getFloat(range[indexTo], 'z');
                var toVec = vec3.fromValues(toX,toY,toZ);

                if (toX == null || toY == null || toZ == null || isNaN(toX) || isNaN(toY) || isNaN(toZ)) {
                    return "x, y and z can't be null.";
                }

                this.views.cameras[id] = new CGFcamera(angle*DEGREE_TO_RAD, near, far, fromVec, toVec);
            }
            else if (children[i].nodeName == "ortho") {
                var near, far, bottom, top, left, right;

                near = this.reader.getFloat(children[i], 'near');
                if (near == null || isNaN(near)) {
                    near = 1;
                    return "Near element must not be null.";
                }

                far = this.reader.getFloat(children[i], 'far');
                if (far == null || isNaN(far)) {
                    far = 1;
                    return "Far element must not be null.";
                }
                else if (near >= far)
                    return '"near" must be smaller than "far"';

                bottom = this.reader.getFloat(children[i], 'bottom');
                if (bottom == null || isNaN(bottom)) {
                    bottom = 1;
                    return "Bottom element must not be null.";
                }

                top = this.reader.getFloat(children[i], 'top');
                if (top == null || isNaN(top)) {
                    top = 1;
                    return "Top element must not be null.";
                }
                else if (bottom >= top)
                    return '"bottom" must be smaller than "top"';

                left = this.reader.getFloat(children[i], 'left');
                if (left == null || isNaN(left)) {
                    left = 1;
                    return "Left element must not be null.";
                }

                right = this.reader.getFloat(children[i], 'right');
                if (right == null || isNaN(right)) {
                    right = 1;
                    return "Right element must not be null."
                }
                else if (left >= right)
                    return '"left" must be smaller than "right"';

                var range = children[i].children;

                var rangeNames = [];

                for (var j = 0; j < range.length; j++)
                    rangeNames.push(range[j].nodeName);

                if (children[i].getElementsByTagName('from').length != 1)
                    return 'one and only one "from" tag must be defined';

                if (children[i].getElementsByTagName('to').length != 1)
                    return 'one and only one "to" tag must be defined';

                var indexFrom = rangeNames.indexOf("from");
                var indexTo = rangeNames.indexOf("to");

                var fromX = this.reader.getFloat(range[indexFrom], 'x');
                var fromY = this.reader.getFloat(range[indexFrom], 'y');
                var fromZ = this.reader.getFloat(range[indexFrom], 'z');
                var fromVec = vec3.fromValues(fromX,fromY,fromZ);

                if (fromX == null || fromY == null || fromZ == null || isNaN(fromX) || isNaN(fromY) || isNaN(fromZ)) {
                    return "x, y and z can't be null.";
                }

                var toX = this.reader.getFloat(range[indexTo], 'x');
                var toY = this.reader.getFloat(range[indexTo], 'y');
                var toZ = this.reader.getFloat(range[indexTo], 'z');
                var toVec = vec3.fromValues(toX,toY,toZ);

                if (toX == null || toY == null || toZ == null || isNaN(toX) || isNaN(toY) || isNaN(toZ)) {
                    return "x, y and z can't be null.";
                }

                var upVec = vec3.fromValues(0,1,0);

                this.views.cameras[id] = new CGFcameraOrtho(left, right, bottom, top, near, far, fromVec, toVec, upVec);
            }
        }
    }

    /**
     * Parses the <ambient> block.
     * @param {XML ambient node} viewsNode
     */
    parseAmbient(ambientNode) {
        var children = ambientNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        if (ambientNode.getElementsByTagName('ambient').length != 1)
            return 'one and only one "ambient" tag must be defined';

        if (ambientNode.getElementsByTagName('background').length != 1)
            return 'one and only one "background" tag must be defined';

        this.ambient = [];

        var indexAmbient = nodeNames.indexOf("ambient");
        var indexBackground = nodeNames.indexOf("background");

        if (indexAmbient != -1) {
            this.ambient.ambientLight = [];

            var r, g, b, a;

            r = this.reader.getFloat(children[indexAmbient], 'r');
            if (r == null || isNaN(r)) {
                r = 1;
                return '"r" element must not be null. Assuming r=1';
            }
            else if (r < 0 || r > 1) {
                r = 1;
                return '"r" element must be between 0 and 1. Assuming r=1';
            }

            g = this.reader.getFloat(children[indexAmbient], 'g');
            if (g == null || isNaN(g)) {
                g = 1;
                return '"g" element must not be null. Assuming g=1';
            }
            else if (g < 0 || g > 1) {
                g = 1;
                return '"g" element must be between 0 and 1. Assuming g=1';
            }

            b = this.reader.getFloat(children[indexAmbient], 'b');
            if (b == null || isNaN(b)) {
                b = 1;
                return '"b" element must not be null. Assuming b=1';
            }
            else if (b < 0 || b > 1) {
                b = 1;
                return '"b" element must be between 0 and 1. Assuming b=1';
            }

            a = this.reader.getFloat(children[indexAmbient], 'a');
            if (a == null || isNaN(a)) {
                a = 1;
                return '"a" element must not be null. Assuming a=1';
            }
            else if (a < 0 || a > 1) {
                a = 1;
                return '"a" element must be between 0 and 1. Assuming a=1';
            }

            this.ambient.ambientLight.r = r;
            this.ambient.ambientLight.g = g;
            this.ambient.ambientLight.b = b;
            this.ambient.ambientLight.a = a;
        }

        if (indexBackground != -1) {
            this.ambient.backgroundLight = [];

            var r, g, b, a;

            r = this.reader.getFloat(children[indexBackground], 'r');
            if (r == null || isNaN(r)) {
                r = 1;
                return '"r" element must not be null. Assuming r=1';
            }
            else if (r < 0 || r > 1) {
                r = 1;
                return '"r" element must be between 0 and 1. Assuming r=1';
            }

            g = this.reader.getFloat(children[indexBackground], 'g');
            if (g == null || isNaN(g)) {
                g = 1;
                return '"g" element must not be null. Assuming g=1';
            }
            else if (g < 0 || g > 1) {
                g = 1;
                return '"g" element must be between 0 and 1. Assuming g=1';
            }

            b = this.reader.getFloat(children[indexBackground], 'b');
            if (b == null || isNaN(b)) {
                b = 1;
                return '"b" element must not be null. Assuming b=1';
            }
            else if (b < 0 || b > 1) {
                b = 1;
                return '"b" element must be between 0 and 1. Assuming b=1';
            }

            a = this.reader.getFloat(children[indexBackground], 'a');
            if (a == null || isNaN(a)) {
                a = 1;
                return '"a" element must not be null. Assuming a=1';
            }
            else if (a < 0 || a > 1) {
                a = 1;
                return '"a" element must be between 0 and 1. Assuming a=1';
            }

            this.ambient.backgroundLight.r = r;
            this.ambient.backgroundLight.g = g;
            this.ambient.backgroundLight.b = b;
            this.ambient.backgroundLight.a = a;
        }
    }

    /**
     * Parses the <lights> block.
     * @param {XML lights node} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var light = [];
            var attrs = children[i].children;
            var id, enabled, location = [], ambient = [], diffuse = [], specular = [];

            id = this.reader.getString(children[i], 'id');
            if (id == null || id == "") {
                id = i;
                return "Id element must not be null.";
            }

            if(this.lights[id] != null)
                return "Id element must be unique for each light (Duplicate: " + id + ")";

            enabled = this.reader.getBoolean(children[i], 'enabled');
            if (enabled == null || isNaN(enabled)) {
                enabled = 0;
                return "Enabled element must not be null.";
            }
            else if (enabled != 0 && enabled != 1) {
                enabled = 0;
                return "Enabled must be 0 or 1.";
            }

            var attrNames = [];

            for (var j = 0; j < attrs.length; j++)
                attrNames.push(attrs[j].nodeName);

            if (children[i].getElementsByTagName('location').length > 1)
                return "no more than one location may be defined";

            if (children[i].getElementsByTagName('ambient').length > 1)
                return "no more than one ambient element may be defined";

            if (children[i].getElementsByTagName('diffuse').length > 1)
                return "no more than one diffuse element may be defined";

            if (children[i].getElementsByTagName('specular').length > 1)
                return "no more than one specular element may be defined";

            var indexLocation = attrNames.indexOf("location");
            var indexAmbient = attrNames.indexOf("ambient");
            var indexDiffuse = attrNames.indexOf("diffuse");
            var indexSpecular = attrNames.indexOf("specular");

            if (indexLocation != -1) {
                var x, y, z, w;

                x = this.reader.getFloat(attrs[indexLocation], 'x');
                if (x == null || isNaN(x)) {
                    x = 0;
                    return '"x" element must not be null. Assuming x=0';
                }

                y = this.reader.getFloat(attrs[indexLocation], 'y');
                if (y == null || isNaN(y)) {
                    y = 0;
                    return '"y" element must not be null. Assuming y=0';
                }

                z = this.reader.getFloat(attrs[indexLocation], 'z');
                if (z == null || isNaN(z)) {
                    z = 0;
                    return '"z" element must not be null. Assuming z=0';
                }

                w = this.reader.getFloat(attrs[indexLocation], 'w');
                if (w == null || isNaN(w)) {
                    w = 0;
                    return '"w" element must not be null. Assuming w=0';
                }

                location.push(x);
                location.push(y);
                location.push(z);
                location.push(w);
            }
            else {
                return "Location must be defined."
            }

            if (indexAmbient != -1) {
                var r, g, b, a;

                r = this.reader.getFloat(attrs[indexAmbient], 'r');
                if (r == null || isNaN(r)) {
                    r = 1;
                    return '"r" element must not be null. Assuming r=1';
                }
                else if (r < 0 || r > 1) {
                    r = 1;
                    return '"r" element must be between 0 and 1. Assuming r=1';
                }

                g = this.reader.getFloat(attrs[indexAmbient], 'g');
                if (g == null || isNaN(g)) {
                    g = 1;
                    return '"g" element must not be null. Assuming g=1';
                }
                else if (g < 0 || g > 1) {
                    g = 1;
                    return '"g" element must be between 0 and 1. Assuming g=1';
                }

                b = this.reader.getFloat(attrs[indexAmbient], 'b');
                if (b == null || isNaN(b)) {
                    b = 1;
                    return '"b" element must not be null. Assuming b=1';
                }
                else if (b < 0 || b > 1) {
                    b = 1;
                    return '"b" element must be between 0 and 1. Assuming b=1';
                }

                a = this.reader.getFloat(attrs[indexAmbient], 'a');
                if (a == null || isNaN(a)) {
                    a = 1;
                    return '"a" element must not be null. Assuming a=1';
                }
                else if (a < 0 || a > 1) {
                    a = 1;
                    return '"a" element must be between 0 and 1. Assuming a=1';
                }

                ambient.push(r);
                ambient.push(g);
                ambient.push(b);
                ambient.push(a);
            }
            else {
                return "Ambient must be defined."
            }

            if (indexDiffuse != -1) {
                var r, g, b, a;

                r = this.reader.getFloat(attrs[indexDiffuse], 'r');
                if (r == null || isNaN(r)) {
                    r = 1;
                    return '"r" element must not be null. Assuming r=1';
                }
                else if (r < 0 || r > 1) {
                    r = 1;
                    return '"r" element must be between 0 and 1. Assuming r=1';
                }

                g = this.reader.getFloat(attrs[indexDiffuse], 'g');
                if (g == null || isNaN(g)) {
                    g = 1;
                    return '"g" element must not be null. Assuming g=1';
                }
                else if (g < 0 || g > 1) {
                    g = 1;
                    return '"g" element must be between 0 and 1. Assuming g=1';
                }

                b = this.reader.getFloat(attrs[indexDiffuse], 'b');
                if (b == null || isNaN(b)) {
                    b = 1;
                    return '"b" element must not be null. Assuming b=1';
                }
                else if (b < 0 || b > 1) {
                    b = 1;
                    return '"b" element must be between 0 and 1. Assuming b=1';
                }

                a = this.reader.getFloat(attrs[indexDiffuse], 'a');
                if (a == null || isNaN(a)) {
                    a = 1;
                    return '"a" element must not be null. Assuming a=1';
                }
                else if (a < 0 || a > 1) {
                    a = 1;
                    return '"a" element must be between 0 and 1. Assuming a=1';
                }

                diffuse.push(r);
                diffuse.push(g);
                diffuse.push(b);
                diffuse.push(a);
            }
            else {
                return "Diffuse must be defined."
            }

            if (indexSpecular != -1) {
                var r, g, b, a;

                r = this.reader.getFloat(attrs[indexSpecular], 'r');
                if (r == null || isNaN(r)) {
                    r = 1;
                    return '"r" element must not be null. Assuming r=1';
                }
                else if (r < 0 || r > 1) {
                    r = 1;
                    return '"r" element must be between 0 and 1. Assuming r=1';
                }

                g = this.reader.getFloat(attrs[indexSpecular], 'g');
                if (g == null || isNaN(g)) {
                    g = 1;
                    return '"g" element must not be null. Assuming g=1';
                }
                else if (g < 0 || g > 1) {
                    g = 1;
                    return '"g" element must be between 0 and 1. Assuming g=1';
                }

                b = this.reader.getFloat(attrs[indexSpecular], 'b');
                if (b == null || isNaN(b)) {
                    b = 1;
                    return '"b" element must not be null. Assuming b=1';
                }
                else if (b < 0 || b > 1) {
                    b = 1;
                    return '"b" element must be between 0 and 1. Assuming b=1';
                }

                a = this.reader.getFloat(attrs[indexSpecular], 'a');
                if (a == null || isNaN(a)) {
                    a = 1;
                    return '"a" element must not be null. Assuming a=1';
                }
                else if (a < 0 || a > 1) {
                    a = 1;
                    return '"a" element must be between 0 and 1. Assuming a=1';
                }

                specular.push(r);
                specular.push(g);
                specular.push(b);
                specular.push(a);
            }
            else {
                return "Specular must be defined."
            }

            light.enabled = enabled ? true : false;
            light.location = location;
            light.ambient = ambient;
            light.diffuse = diffuse;
            light.specular = specular;

            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (angle == null || isNaN(angle)) {
                    angle = 0;
                    return "Angle element must not be null.";
                }

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (exponent == null || isNaN(exponent)) {
                    exponent = 0;
                    return "Exponent element must not be null.";
                }

                if (children[i].getElementsByTagName('target').length > 1)
                    return "no more than one target may be defined";

                var indexTarget = attrNames.indexOf("target");

                if (indexTarget != -1) {
                    var target = [];
                    var x, y, z;

                    x = this.reader.getFloat(attrs[indexTarget], 'x');
                    if (x == null || isNaN(x)) {
                        x = 0;
                        return '"x" element must not be null. Assuming x=0';
                    }

                    y = this.reader.getFloat(attrs[indexTarget], 'y');
                    if (y == null || isNaN(y)) {
                        y = 0;
                        return '"y" element must not be null. Assuming y=0';
                    }

                    z = this.reader.getFloat(attrs[indexTarget], 'z');
                    if (z == null || isNaN(z)) {
                        z = 0;
                        return '"z" element must not be null. Assuming z=0';
                    }

                    target.push(x);
                    target.push(y);
                    target.push(z);
                }
                else {
                    return "Target must be defined."
                }

                light.angle = angle;
                light.exponent = exponent;
                light.target = target;
                light.type = "spot"
            }
            else if (children[i].nodeName == "omni") {
                light.type = "omni";
            }

            this.lights[id] = light;
        }
    }

    /**
     * Parses the <textures> block.
     * @param {XML textures node} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        this.textures = [];

        if (texturesNode.getElementsByTagName('texture').length < 1)
            return 'at least one "texture" tag must be defined';

        for (var i = 0; i < children.length; i++) {
            var texture;

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var id;

            id = this.reader.getString(children[i], 'id');
            if (id == null || id == "") {
                id = i;
                return "Id element must not be null.";
            }

            if(this.textures[id] != null)
                return "Id element must be unique for each texture. (Duplicate: " + id + ")";

            texture = this.reader.getString(children[i], 'file');
            if (texture == null || texture == "") {
                return "File name is not valid.";
            }

            this.textures[id] = new CGFtexture(this.scene, texture);
        }
    }

    /**
     * Parses the <materials> block.
     * @param {XML materials node} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        if(materialsNode.getElementsByTagName('material').length < 1)
            return 'at least one "material" tag must be defined';

        for (var i = 0; i < children.length; i++) {

            var material = new CGFappearance(this.scene);
            var id, shininess;

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            id = this.reader.getString(children[i], 'id');
            if (id == null || id == "") {
                id = i;
                return "Id element must not be null.";
            }

            if(this.materials[id] != null)
                return "Id element must be unique for each material. (Duplicate: " + id + ")";

            shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null) {
                return "Shininess value must not be null.";
            }
            else if (shininess < 0) {
                return "Shininess value must be higher than 0.";
            }

            material.setShininess(shininess);

            var attrs = children[i].children;
            var attrNames = [];

            for (var j = 0; j < attrs.length; j++)
                attrNames.push(attrs[j].nodeName);

            if (children[i].getElementsByTagName('specular').length > 1)
                return "no more than one specular may be defined";

            if (children[i].getElementsByTagName('diffuse').length > 1)
                return "no more than one diffuse element may be defined";

            if (children[i].getElementsByTagName('ambient').length > 1)
                return "no more than one diffuse element may be defined";

            if (children[i].getElementsByTagName('emission').length > 1)
                return "no more than one emission element may be defined";

            var indexSpecular = attrNames.indexOf("specular");
            var indexDiffuse = attrNames.indexOf("diffuse");
            var indexAmbient = attrNames.indexOf("ambient");
            var indexEmission = attrNames.indexOf("emission");

            if (indexSpecular != -1) {
                var r, g, b, a;

                r = this.reader.getFloat(attrs[indexSpecular], 'r');
                if (r == null || isNaN(r)) {
                    r = 1;
                    return '"r" element must not be null. Assuming r=1';
                }
                else if (r < 0 || r > 1) {
                    r = 1;
                    return '"r" element must be between 0 and 1. Assuming r=1';
                }

                g = this.reader.getFloat(attrs[indexSpecular], 'g');
                if (g == null || isNaN(g)) {
                    g = 1;
                    return '"g" element must not be null. Assuming g=1';
                }
                else if (g < 0 || g > 1) {
                    g = 1;
                    return '"g" element must be between 0 and 1. Assuming g=1';
                }

                b = this.reader.getFloat(attrs[indexSpecular], 'b');
                if (b == null || isNaN(b)) {
                    b = 1;
                    return '"b" element must not be null. Assuming b=1';
                }
                else if (b < 0 || b > 1) {
                    b = 1;
                    return '"b" element must be between 0 and 1. Assuming b=1';
                }

                a = this.reader.getFloat(attrs[indexSpecular], 'a');
                if (a == null || isNaN(a)) {
                    a = 1;
                    return '"a" element must not be null. Assuming a=1';
                }
                else if (a < 0 || a > 1) {
                    a = 1;
                    return '"a" element must be between 0 and 1. Assuming a=1';
                }

                material.setSpecular(r, g, b, a);
            }
            else {
                return "Specular must be defined."
            }

            if (indexDiffuse != -1) {
                var r, g, b, a;

                r = this.reader.getFloat(attrs[indexDiffuse], 'r');
                if (r == null || isNaN(r)) {
                    r = 1;
                    return '"r" element must not be null. Assuming r=1';
                }
                else if (r < 0 || r > 1) {
                    r = 1;
                    return '"r" element must be between 0 and 1. Assuming r=1';
                }

                g = this.reader.getFloat(attrs[indexDiffuse], 'g');
                if (g == null || isNaN(g)) {
                    g = 1;
                    return '"g" element must not be null. Assuming g=1';
                }
                else if (g < 0 || g > 1) {
                    g = 1;
                    return '"g" element must be between 0 and 1. Assuming g=1';
                }

                b = this.reader.getFloat(attrs[indexDiffuse], 'b');
                if (b == null || isNaN(b)) {
                    b = 1;
                    return '"b" element must not be null. Assuming b=1';
                }
                else if (b < 0 || b > 1) {
                    b = 1;
                    return '"b" element must be between 0 and 1. Assuming b=1';
                }

                a = this.reader.getFloat(attrs[indexDiffuse], 'a');
                if (a == null || isNaN(a)) {
                    a = 1;
                    return '"a" element must not be null. Assuming a=1';
                }
                else if (a < 0 || a > 1) {
                    a = 1;
                    return '"a" element must be between 0 and 1. Assuming a=1';
                }

                material.setDiffuse(r, g, b, a);
            }
            else {
                return "Diffuse must be defined."
            }

            if (indexAmbient != -1) {
                var r, g, b, a;

                r = this.reader.getFloat(attrs[indexAmbient], 'r');
                if (r == null || isNaN(r)) {
                    r = 1;
                    return '"r" element must not be null. Assuming r=1';
                }
                else if (r < 0 || r > 1) {
                    r = 1;
                    return '"r" element must be between 0 and 1. Assuming r=1';
                }

                g = this.reader.getFloat(attrs[indexAmbient], 'g');
                if (g == null || isNaN(g)) {
                    g = 1;
                    return '"g" element must not be null. Assuming g=1';
                }
                else if (g < 0 || g > 1) {
                    g = 1;
                    return '"g" element must be between 0 and 1. Assuming g=1';
                }

                b = this.reader.getFloat(attrs[indexAmbient], 'b');
                if (b == null || isNaN(b)) {
                    b = 1;
                    return '"b" element must not be null. Assuming b=1';
                }
                else if (b < 0 || b > 1) {
                    b = 1;
                    return '"b" element must be between 0 and 1. Assuming b=1';
                }

                a = this.reader.getFloat(attrs[indexAmbient], 'a');
                if (a == null || isNaN(a)) {
                    a = 1;
                    return '"a" element must not be null. Assuming a=1';
                }
                else if (a < 0 || a > 1) {
                    a = 1;
                    return '"a" element must be between 0 and 1. Assuming a=1';
                }

                material.setAmbient(r, g, b, a);
            }
            else {
                return "Ambient must be defined."
            }

            if (indexEmission != -1) {
                var r, g, b, a;

                r = this.reader.getFloat(attrs[indexEmission], 'r');
                if (r == null || isNaN(r)) {
                    r = 1;
                    return '"r" element must not be null. Assuming r=1';
                }
                else if (r < 0 || r > 1) {
                    r = 1;
                    return '"r" element must be between 0 and 1. Assuming r=1';
                }

                g = this.reader.getFloat(attrs[indexEmission], 'g');
                if (g == null || isNaN(g)) {
                    g = 1;
                    return '"g" element must not be null. Assuming g=1';
                }
                else if (g < 0 || g > 1) {
                    g = 1;
                    return '"g" element must be between 0 and 1. Assuming g=1';
                }

                b = this.reader.getFloat(attrs[indexEmission], 'b');
                if (b == null || isNaN(b)) {
                    b = 1;
                    return '"b" element must not be null. Assuming b=1';
                }
                else if (b < 0 || b > 1) {
                    b = 1;
                    return '"b" element must be between 0 and 1. Assuming b=1';
                }

                a = this.reader.getFloat(attrs[indexEmission], 'a');
                if (a == null || isNaN(a)) {
                    a = 1;
                    return '"a" element must not be null. Assuming a=1';
                }
                else if (a < 0 || a > 1) {
                    a = 1;
                    return '"a" element must be between 0 and 1. Assuming a=1';
                }

                material.setEmission(r, g, b, a);
            }
            else {
                return "Emission must be defined."
            }

            material.setTextureWrap('REPEAT', 'REPEAT');

            this.materials[id] = material;
        }
    }

    /**
     * Parses the <transformations> block.
     * @param {XML transformations node} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        if(transformationsNode.getElementsByTagName('transformation').length < 1)
            return 'at least one "transformation" tag must be defined';

        this.transformations = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var instructions = mat4.create();
            mat4.identity(instructions);
            var attrs = children[i].children;
            var id;

            if (attrs.length == 0) {
                return "There must exist at least one transformation (translate, rotate or scale)";
            }

            id = this.reader.getString(children[i], 'id');
            if (id == null || id == "") {
                id = i;
                return "Id element must not be null.";
            }

            if(this.transformations[id] != null)
                return "Id element must be unique for each transformation. (Duplicate: " + id + ")";

            for (var j = 0; j < attrs.length; j++) {
                var instruction = vec3.create();

                if (attrs[j].nodeName == "translate") {
                    var x, y, z;

                    x = this.reader.getFloat(attrs[j], 'x');
                    if (x == null || isNaN(x)) {
                        x = 0;
                        return '"x" element must not be null. Assuming x=0';
                    }

                    y = this.reader.getFloat(attrs[j], 'y');
                    if (y == null || isNaN(y)) {
                        y = 0;
                        return '"y" element must not be null. Assuming y=0';
                    }

                    z = this.reader.getFloat(attrs[j], 'z');
                    if (z == null || isNaN(z)) {
                        z = 0;
                        return '"z" element must not be null. Assuming z=0';
                    }

                    vec3.set(instruction, x, y, z);
                    mat4.translate(instructions,instructions,instruction);
                }
                else if (attrs[j].nodeName == "rotate") {
                    var axis, angle;

                    axis = this.reader.getString(attrs[j], 'axis');
                    if (axis == null || axis == '') {
                        axis = 'x';
                        return '"axis" element must not be null. Assuming axis=x';
                    }
                    else if (axis != 'x' && axis != 'y' && axis != 'z') {
                        return '"axis" must correspond to one of the axis (x, y or z)';
                    }

                    angle = this.reader.getFloat(attrs[j], 'angle');
                    if (angle == null || isNaN(angle)) {
                        angle = 0;
                        return '"angle" element must not be null. Assuming angle=0';
                    }

                    if (axis == 'x') {
                        mat4.rotateX(instructions,instructions,angle*DEGREE_TO_RAD);
                    }
                    else if (axis == 'y') {
                        mat4.rotateY(instructions,instructions,angle*DEGREE_TO_RAD);
                    }
                    else {
                        mat4.rotateZ(instructions,instructions,angle*DEGREE_TO_RAD);
                    }
                }
                else if (attrs[j].nodeName == "scale") {
                    var x, y, z;

                    x = this.reader.getFloat(attrs[j], 'x');
                    if (x == null || isNaN(x)) {
                        x = 0;
                        return '"x" element must not be null. Assuming x=0';
                    }

                    y = this.reader.getFloat(attrs[j], 'y');
                    if (y == null || isNaN(y)) {
                        y = 0;
                        return '"y" element must not be null. Assuming y=0';
                    }

                    z = this.reader.getFloat(attrs[j], 'z');
                    if (z == null || isNaN(z)) {
                        z = 0;
                        return '"z" element must not be null. Assuming z=0';
                    }

                    vec3.set(instruction, x, y, z);
                    mat4.scale(instructions,instructions,instruction);

                }
                else {
                    this.onXMLMinorError("unknown tag <" + attrs[j].nodeName + ">");
                }
            }

            this.transformations[id] = instructions;
        }
    }

    /**
     * Parses the <animations> block.
     * @param {XML primitives node} primitiveNodes
     */
    parseAnimations(animationNodes) {
        var children = animationNodes.children;

        this.animations = [];

        for (var i = 0; i < children.length; i++) {
            var animation = [];

            if (children[i].nodeName != "linear" && children[i].nodeName != "circular") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(children[i], 'id');
            if (id == null || id == "") {
                return "Id element must not be null.";
            }

            var span = this.reader.getFloat(children[i], 'span');
            if (span == null || isNaN(span)) {
                return "Span element must not be null.";
            }
            else if(span < 0) {
                return "Span element must not be negative.";
            }
            span *= 1000;

            if (children[i].nodeName == "linear") {
                var attrs = children[i].children;
                var controlPoints = [];

                if (attrs.length < 2) {
                    return "At least 2 control points may be defined.";
                }

                for (var j = 0; j < attrs.length; j++) {
                    if (attrs[j].nodeName != "controlpoint") {
                        this.onXMLMinorError("unknown tag <" + attrs[0].nodeName + ">");
                        continue;
                    }

                    var controlPoint = [];

                    controlPoint.x = this.reader.getFloat(attrs[j], 'xx');
                    if (controlPoint.x == null || isNaN(controlPoint.x)) {
                        return "X element must not be null.";
                    }

                    controlPoint.y = this.reader.getFloat(attrs[j], 'yy');
                    if (controlPoint.y == null || isNaN(controlPoint.y)) {
                        return "Y element must not be null.";
                    }

                    controlPoint.z = this.reader.getFloat(attrs[j], 'zz');
                    if (controlPoint.z == null || isNaN(controlPoint.z)) {
                        return "Z element must not be null.";
                    }

                    controlPoints.push(controlPoint);
                }

                this.animations[id] = new LinearAnimation(this.scene, span, controlPoints)
            }
            else if (children[i].nodeName == "circular") {

              var center = this.reader.getString(children[i], 'center');
              if (center == null || center == "") {
                  return "Center element must not be null.";
              }
              var centerFloat = center.split(' ');
              centerFloat[0] = parseFloat(centerFloat[0]);
              centerFloat[1] = parseFloat(centerFloat[1]);
              centerFloat[2] = parseFloat(centerFloat[2]);

              if(centerFloat[0] == null || isNaN(centerFloat[0])) {
                  return "First center coordinate must not be null";
              }
              if(centerFloat[1] == null || isNaN(centerFloat[1])) {
                  return "Second center coordinate must not be null";
              }
              if(centerFloat[2] == null || isNaN(centerFloat[2])) {
                  return "Third center coordinate must not be null";
              }

              var radius = this.reader.getFloat(children[i], 'radius');
              if(radius == null || isNaN(radius)) {
                  return "Radius element must not be null.";
              }
              else if(radius < 0) {
                  return "Radius element must not be negative.";
              }

              var startang = this.reader.getFloat(children[i], 'startang');
              if(startang == null || isNaN(startang)) {
                  return "Startang element must not be null.";
              }

              var rotang = this.reader.getFloat(children[i], 'rotang');
              if(rotang == null || isNaN(rotang)) {
                  return "Rotang element must not be null.";
              }

              this.animations[id] = new CircularAnimation(this.scene, span, centerFloat, radius, startang, rotang);
            }
        }
    }

    /**
     * Parses the <primitives> block.
     * @param {XML primitives node} primitiveNodes
     */
    parsePrimitives(primitiveNodes) {
        var children = primitiveNodes.children;

        if(primitiveNodes.getElementsByTagName('primitive').length < 1)
            return 'at least one "primitive" tag must be defined';

        this.primitives = [];

        for (var i = 0; i < children.length; i++) {
            var primitive = [];

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var attrs = children[i].children;
            var id;

            if (attrs.length > 1) {
                return "Only 1 primitive may be defined.";
            }

            id = this.reader.getString(children[i], 'id');
            if (id == null || id == "") {
                id = i;
                return "Id element must not be null.";
            }

            if(this.primitives[id] != null)
                return "Id element must be unique for each primitive. (Duplicate: " + id + ")";

            if(attrs[0].nodeName == "cylinder") {
                var base, top, height, slices, stacks;

                base = this.reader.getFloat(attrs[0], 'base');
                if (base == null || isNaN(base)) {
                    base = 1;
                    return '"base" element must not be null. Assuming base=1';
                }

                top = this.reader.getFloat(attrs[0], 'top');
                if (top == null || isNaN(top)) {
                    top = 1;
                    return '"top" element must not be null. Assuming top=1';
                }

                height = this.reader.getFloat(attrs[0], 'height');
                if (height == null || isNaN(height)) {
                    height = 1;
                    return '"height" element must not be null. Assuming height=1';
                }

                slices = this.reader.getInteger(attrs[0], 'slices');
                if (slices == null || isNaN(slices)) {
                    slices = 3;
                    return '"slices" element must not be null. Assuming slices=3';
                }

                stacks = this.reader.getInteger(attrs[0], 'stacks');
                if (stacks == null || isNaN(stacks)) {
                    stacks = 1;
                    return '"stacks" element must not be null. Assuming stacks=1';
                }

                primitive = new MyCoveredCylinder(this.scene, base, top, height, slices, stacks);
            }
            else if (attrs[0].nodeName == "rectangle") {
                var x1, y1, x2, y2;

                x1 = this.reader.getFloat(attrs[0], 'x1');
                if (x1 == null || isNaN(x1)) {
                    x1 = 1;
                    return '"x1" element must not be null. Assuming x1=1';
                }

                y1 = this.reader.getFloat(attrs[0], 'y1');
                if (y1 == null || isNaN(y1)) {
                    y1 = 1;
                    return '"y1" element must not be null. Assuming y1=1';
                }

                x2 = this.reader.getFloat(attrs[0], 'x2');
                if (x2 == null || isNaN(x2)) {
                    x2 = 2;
                    return '"x2" element must not be null. Assuming x2=2';
                }

                y2 = this.reader.getFloat(attrs[0], 'y2');
                if (y2 == null || isNaN(y2)) {
                    y2 = 2;
                    return '"y2" element must not be null. Assuming y2=2';
                }

                primitive = new MyRectangle(this.scene, x1, y1, x2, y2);
            }
            else if (attrs[0].nodeName == "triangle") {
                var x1, y1, z1, x2, y2, z2, x3, y3, z3;

                x1 = this.reader.getFloat(attrs[0], 'x1');
                if (x1 == null || isNaN(x1)) {
                    x1 = 0;
                    return '"x1" element must not be null. Assuming x1=0';
                }

                y1 = this.reader.getFloat(attrs[0], 'y1');
                if (y1 == null || isNaN(y1)) {
                    y1 = 0;
                    return '"y1" element must not be null. Assuming y1=0';
                }

                z1 = this.reader.getFloat(attrs[0], 'z1');
                if (z1 == null || isNaN(z1)) {
                    z1 = 0;
                    return '"z1" element must not be null. Assuming z1=0';
                }

                x2 = this.reader.getFloat(attrs[0], 'x2');
                if (x2 == null || isNaN(x2)) {
                    x2 = 0;
                    return '"x2" element must not be null. Assuming x2=0';
                }

                y2 = this.reader.getFloat(attrs[0], 'y2');
                if (y2 == null || isNaN(y2)) {
                    y2 = 1;
                    return '"y2" element must not be null. Assuming y2=1';
                }

                z2 = this.reader.getFloat(attrs[0], 'z2');
                if (z2 == null || isNaN(z2)) {
                    z2 = 0;
                    return '"z2" element must not be null. Assuming z2=0';
                }

                x3 = this.reader.getFloat(attrs[0], 'x3');
                if (x3 == null || isNaN(x3)) {
                    x3 = 1;
                    return '"x3" element must not be null. Assuming x3=1';
                }

                y3 = this.reader.getFloat(attrs[0], 'y3');
                if (y3 == null || isNaN(y3)) {
                    y3 = 0.5;
                    return '"y3" element must not be null. Assuming y3=0.5';
                }

                z3 = this.reader.getFloat(attrs[0], 'z3');
                if (z3 == null || isNaN(z3)) {
                    z3 = 0;
                    return '"z3" element must not be null. Assuming z3=0';
                }

                primitive = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
            }
            else if (attrs[0].nodeName == "sphere") {
                var radius, slices, stacks;

                radius = this.reader.getFloat(attrs[0], 'radius');
                if (radius == null || isNaN(radius)) {
                    radius = 1;
                    return '"radius" element must not be null. Assuming radius=1';
                }

                slices = this.reader.getInteger(attrs[0], 'slices');
                if (slices == null || isNaN(slices)) {
                    slices = 3;
                    return '"slices" element must not be null. Assuming slices=3';
                }

                stacks = this.reader.getInteger(attrs[0], 'stacks');
                if (stacks == null || isNaN(stacks)) {
                    stacks = 1;
                    return '"stacks" element must not be null. Assuming stacks=1';
                }

                primitive = new MySphere(this.scene, radius, slices, stacks);
            }
            else if (attrs[0].nodeName == "torus") {
                var inner, outer, slices, loops;

                inner = this.reader.getFloat(attrs[0], 'inner');
                if (inner == null || isNaN(inner)) {
                    inner = 1;
                    return '"inner" element must not be null. Assuming inner=1';
                }

                outer = this.reader.getFloat(attrs[0], 'outer');
                if (outer == null || isNaN(outer)) {
                    outer = 1;
                    return '"outer" element must not be null. Assuming outer=1';
                }

                slices = this.reader.getInteger(attrs[0], 'slices');
                if (slices == null || isNaN(slices)) {
                    slices = 3;
                    return '"slices" element must not be null. Assuming slices=3';
                }

                loops = this.reader.getInteger(attrs[0], 'loops');
                if (loops == null || isNaN(loops)) {
                    loops = 1;
                    return '"loops" element must not be null. Assuming loops=1';
                }

                primitive = new MyTorus(this.scene, inner, outer, slices, loops)
            }
            else if (attrs[0].nodeName == "plane") {
                var npartsU, npartsV;

                npartsU = this.reader.getInteger(attrs[0], 'npartsU');
                if (npartsU == null || isNaN(npartsU)) {
                    return '"npartsU" element must not be null.';
                }

                npartsV = this.reader.getInteger(attrs[0], 'npartsV');
                if (npartsV == null || isNaN(npartsV)) {
                    return '"npartsV" element must not be null.';
                }

                primitive = new Plane(this.scene, npartsU, npartsV);
            }
            else {
              this.onXMLMinorError("unknown tag <" + attrs[0].nodeName + ">");
            }

            this.primitives[id] = primitive;
        }
    }

    /**
     * Parses the <components> block.
     * @param {XML components node} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        if(componentsNode.getElementsByTagName('component').length < 1)
            return 'at least one component must be defined';

        this.components = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var component = [];
            var attrs = children[i].children;
            var id;

            id = this.reader.getString(children[i], 'id');
            if (id == null || id == "") {
                id = i;
                return "Id element must not be null.";
            }

            if(this.components[id] != null)
                return "Id element must be unique for each component. (Duplicate: " + id + ")";

            var attrNames = [];

            for (var j = 0; j < attrs.length; j++)
                attrNames.push(attrs[j].nodeName);

            if (children[i].getElementsByTagName('transformation').length > 1)
                return "no more than one transformation may be defined";

            if (children[i].getElementsByTagName('animations').length > 1)
                return "no more than one animations tag may be defined";

            if (children[i].getElementsByTagName('materials').length > 1)
                return "no more than one materials tag may be defined";

            if (children[i].getElementsByTagName('texture').length > 1)
                return "no more than one texture may be defined";

            if (children[i].getElementsByTagName('children').length > 1)
                return "no more than one children tag may be defined";

            if (attrs.length > 5) {
                return "only 4 tags may be defined";
            }

            var indexTransformation = attrNames.indexOf("transformation");
            var indexAnimations = attrNames.indexOf("animations");
            var indexMaterials = attrNames.indexOf("materials");
            var indexTexture = attrNames.indexOf("texture");
            var indexChildren = attrNames.indexOf("children");

            if (indexTransformation != -1) {
                var transformation = mat4.create();
                mat4.identity(transformation);

                if (attrs[indexTransformation].getElementsByTagName("transformationref").length == 0) {
                    var instructions = attrs[indexTransformation].children;

                    if (instructions.length > 0) {
                        for (var j = 0; j < instructions.length; j++) {
                            var instruction = vec3.create();

                            if (instructions[j].nodeName == "translate") {
                                var x, y, z;

                                x = this.reader.getFloat(instructions[j], 'x');
                                if (x == null || isNaN(x)) {
                                    x = 0;
                                    return '"x" element must not be null. Assuming x=0';
                                }

                                y = this.reader.getFloat(instructions[j], 'y');
                                if (y == null || isNaN(y)) {
                                    y = 0;
                                    return '"y" element must not be null. Assuming y=0';
                                }

                                z = this.reader.getFloat(instructions[j], 'z');
                                if (z == null || isNaN(z)) {
                                    z = 0;
                                    return '"z" element must not be null. Assuming z=0';
                                }

                                vec3.set(instruction, x, y, z);
                                mat4.translate(transformation,transformation,instruction);
                            }
                            else if (instructions[j].nodeName == "rotate") {
                                var axis, angle;

                                axis = this.reader.getString(instructions[j], 'axis');
                                if (axis == null || axis == '') {
                                    axis = 'x';
                                    return '"axis" element must not be null. Assuming axis=x';
                                }
                                else if (axis != 'x' && axis != 'y' && axis != 'z') {
                                    return '"axis" must correspond to one of the axis (x, y or z)';
                                }

                                angle = this.reader.getFloat(instructions[j], 'angle');
                                if (angle == null || isNaN(angle)) {
                                    angle = 0;
                                    return '"angle" element must not be null. Assuming angle=0';
                                }

                                if (axis == 'x') {
                                    mat4.rotateX(transformation,transformation,angle*DEGREE_TO_RAD);
                                }
                                else if (axis == 'y') {
                                    mat4.rotateY(transformation,transformation,angle*DEGREE_TO_RAD);
                                }
                                else {
                                    mat4.rotateZ(transformation,transformation,angle*DEGREE_TO_RAD);
                                }
                            }
                            else if (instructions[j].nodeName == "scale") {
                                var x, y, z;

                                x = this.reader.getFloat(instructions[j], 'x');
                                if (x == null || isNaN(x)) {
                                    x = 0;
                                    return '"x" element must not be null. Assuming x=0';
                                }

                                y = this.reader.getFloat(instructions[j], 'y');
                                if (y == null || isNaN(y)) {
                                    y = 0;
                                    return '"y" element must not be null. Assuming y=0';
                                }

                                z = this.reader.getFloat(instructions[j], 'z');
                                if (z == null || isNaN(z)) {
                                    z = 0;
                                    return '"z" element must not be null. Assuming z=0';
                                }

                                vec3.set(instruction, x, y, z);
                                mat4.scale(transformation,transformation,instruction);
                            }
                            else {
                                this.onXMLMinorError("unknown tag <" + instructions[j].nodeName + ">");
                            }

                            component.transformation = transformation;
                        }
                    }
                }
                else if (attrs[indexTransformation].getElementsByTagName("transformationref").length == 1) {
                    var ref = attrs[indexTransformation].children[0];
                    var transformationId;

                    transformationId = this.reader.getString(ref, 'id');
                    if (transformationId == null || transformationId == "") {
                        transformationId = i;
                        return "Id element must not be null.";
                    }

                    if (this.transformations[transformationId] == null) {
                        return "The transformation with the id '" + transformationId +  "' doesn't exist.";
                    }

                    component.transformation = this.transformations[transformationId];
                }
                else {
                    return "no more than one transformationref tag may be defined";
                }
            }
            else {
                return "transformation tag is missing";
            }

            if (indexAnimations != -1) {
                var animations = attrs[indexAnimations].children;

                var animationsContainer = [];

                for (var j = 0; j < animations.length; j++) {
                    if (animations[j].nodeName != "animationref") {
                        this.onXMLMinorError("unknown tag <" + animations[j].nodeName + ">");
                        continue;
                    }

                    var animationId, animation;

                    animationId = this.reader.getString(animations[j], 'id');
                    if (animationId == null || animationId == "") {
                        return "Id element must not be null.";
                    }

                    if (this.animations[animationId] == null) {
                        return "The animation with the id '" + animationId +  "' doesn't exist.";
                    }

                    animation = this.animations[animationId].copy();

                    animationsContainer.push(animation);
                }

                component.currentAnimation = 0;

                component.animations = animationsContainer;
            }

            if (indexMaterials != -1) {
                var materials = attrs[indexMaterials].children;

                if(attrs[indexMaterials].getElementsByTagName('material').length < 1)
                    return 'at least one material must be defined';

                var materialsContainer = [];

                for (var j = 0; j < materials.length; j++) {
                    if (materials[j].nodeName != "material") {
                        this.onXMLMinorError("unknown tag <" + materials[j].nodeName + ">");
                        continue;
                    }

                    var materialId, material;

                    materialId = this.reader.getString(materials[j], 'id');
                    if (materialId == null || materialId == "") {
                        materialId = j;
                        return "Id element must not be null.";
                    }

                    if (materialId == "none") {
                        material = "none";
                    }
                    else if (materialId == "inherit") {
                        material = "inherit";
                    }
                    else {
                        if (this.materials[materialId] == null) {
                            return "The material with the id '" + materialId +  "' doesn't exist.";
                        }

                        material = this.materials[materialId];
                    }

                    materialsContainer.push(material);
                }

                component.materials = materialsContainer;
            }
            else {
                return "materials tag missing";
            }

            if (indexTexture != -1) {
                var textureNode = attrs[indexTexture];

                var texture = [];
                var textureId, textureRef, length_s, length_t;

                textureId = this.reader.getString(textureNode, 'id');
                if (textureId == null || textureId == "") {
                    textureId = j;
                    return "Id element must not be null.";
                }

                if (textureId == "none" || textureId == "inherit") {
                    textureRef = textureId;
                }
                else {
                    if (this.textures[textureId] == null) {
                        return "The texture with the id '" + textureId +  "' doesn't exist.";
                    }

                    textureRef = this.textures[textureId];
                }

                length_s = this.reader.getFloat(textureNode, 'length_s', false);
                if (length_s == null || length_s > 0) {
                    texture.length_s = length_s;
                }
                else if (textureId != "none" && textureId != "inherit" && length_s == null) {
                    return "if a new texture is defined, length_s must be defined.";
                }
                else if (isNaN(length_s)) {
                    return '"length_s" element must be a float.';
                }
                else if (length_s <= 0) {
                    return '"length_s" element must be higher than 0.';
                }

                length_t = this.reader.getFloat(textureNode, 'length_t', false);
                if (length_t == null || length_t > 0) {
                    texture.length_t = length_t;
                }
                else if (textureId != "none" && textureId != "inherit" && length_t == null) {
                    return "if a new texture is defined, length_t must be defined.";
                }
                else if (isNaN(length_t)) {
                    return '"length_t" element must be a float.';
                }
                else if (length_t <= 0) {
                    return '"length_t" element must be higher than 0.';
                }
                texture.length_t = length_t;

                texture.texture = textureRef;

                component.texture = texture;
            }
            else {
                return "texture tag missing";
            }

            if (indexChildren != -1) {
                var childrenElements = attrs[indexChildren].children;

                if(childrenElements.length < 1)
                    return 'at least one child element must be defined must be defined';

                var childrenContainer = [];

                var componentChildren = [];
                var primitiveChildren = [];

                for (var j = 0; j < childrenElements.length; j++) {
                    if (childrenElements[j].nodeName != "componentref" && childrenElements[j].nodeName != "primitiveref") {
                        this.onXMLMinorError("unknown tag <" + childrenElements[j].nodeName + ">");
                        continue;
                    }

                    var childrenId;

                    childrenId = this.reader.getString(childrenElements[j], 'id');
                    if (childrenId == null || childrenId == "") {
                        childrenId = j;
                        return "Id element must not be null.";
                    }

                    if (childrenElements[j].nodeName == "componentref") {
                        var componentRef;

                        var exists = false;
                        for (var k = 0; k < childrenElements.length; k++) {
                            if (this.reader.getString(childrenElements[k], 'id') == childrenId) {
                                componentRef = childrenId;
                                exists = true;
                            }
                        }

                        if (!exists) {
                            return "The component with the id '" + childrenId +  "' doesn't exist.";
                        }

                        componentChildren.push(componentRef);
                    }
                    else if (childrenElements[j].nodeName == "primitiveref") {
                        if (this.primitives[childrenId] == null) {
                            return "The primitive with the id '" + childrenId +  "' doesn't exist.";
                        }

                        primitiveChildren.push(this.primitives[childrenId]);
                    }
                }

                childrenContainer.componentChildren = componentChildren;
                childrenContainer.primitiveChildren = primitiveChildren;

                component.children = childrenContainer;
            }
            else {
                return "children tag missing";
            }

            this.components[id] = component;
        }

        for (var key in this.components) {
            var componentChildrenNew = [];

            for (var j = 0; j < this.components[key].children.componentChildren.length; j++)
                for (var key2 in this.components)
                    if (key2 == this.components[key].children.componentChildren[j])
                        componentChildrenNew[key2] = this.components[key2];

            this.components[key].children.componentChildren = componentChildrenNew;
        }
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the primitives of each node and calls itself recursively to display the child nodes.
     * @param {current node being displayed} node
     * @param {current inherited material} material
     * @param {current inherited texture} texture
     * @param {current inherited s texture coordinate} length_s
     * @param {current inherited t texture coordinate} length_t
     */
    displayNode(node, material, texture, length_s, length_t) {
        this.scene.pushMatrix();

        if (node.transformation != null) {
            this.scene.multMatrix(node.transformation);
            if (node.hasOwnProperty("animations"))
                this.scene.multMatrix(node.animations[node.currentAnimation].transformation);
        }

        if (node.materials[this.currMaterial%node.materials.length] == "inherit") {
            if (node.texture.texture == "inherit") {
                material.setTexture(texture);
            }
            else if (node.texture.texture == "none") {
                material.setTexture(null);
            }
            else {
                material.setTexture(node.texture.texture);
            }

            material.apply();
        }
        else {
            if (node.texture.texture == "inherit") {
                node.materials[this.currMaterial%node.materials.length].setTexture(texture);
            }
            else if (node.texture.texture == "none") {
                node.materials[this.currMaterial%node.materials.length].setTexture(null);
            }
            else {
                node.materials[this.currMaterial%node.materials.length].setTexture(node.texture.texture);
            }

            node.materials[this.currMaterial%node.materials.length].apply();
        }

        for (var i = 0; i < node.children.primitiveChildren.length; i++) {
            if (node.texture.texture == "inherit") {
                if (node.texture.length_s == null && node.texture.length_t == null) {
                    node.children.primitiveChildren[i].updateTexCoords(length_s, length_t);
                }
                else if (node.texture.length_t == null) {
                    node.children.primitiveChildren[i].updateTexCoords(node.texture.length_s, length_t);
                }
                else if (node.texture.length_s == null) {
                    node.children.primitiveChildren[i].updateTexCoords(length_s, node.texture.length_t);
                }
                else {
                    node.children.primitiveChildren[i].updateTexCoords(node.texture.length_s, node.texture.length_t);
                }
            }
            else if (node.texture.texture == "none") {
                node.children.primitiveChildren[i].updateTexCoords(length_s, length_t);
            }
            else {
                node.children.primitiveChildren[i].updateTexCoords(node.texture.length_s, node.texture.length_t);
            }

            node.children.primitiveChildren[i].display();
        }

        for (var key in node.children.componentChildren) {
          if (node.materials[this.currMaterial%node.materials.length] == "inherit") {
              if (node.texture.texture == "inherit") {
                  if (node.texture.length_s == null && node.texture.length_t == null) {
                      this.displayNode(node.children.componentChildren[key], material, texture, length_s, length_t);
                  }
                  else if (node.texture.length_t == null) {
                      this.displayNode(node.children.componentChildren[key], material, texture, node.texture.length_s, length_t);
                  }
                  else if (node.texture.length_s == null) {
                      this.displayNode(node.children.componentChildren[key], material, texture, length_s, node.texture.length_t);
                  }
                  else {
                      this.displayNode(node.children.componentChildren[key], material, texture, node.texture.length_s, node.texture.length_t);
                  }
              }
              else if (node.texture.texture == "none") {
                  this.displayNode(node.children.componentChildren[key], material, null, length_s, length_t);
              }
              else {
                  this.displayNode(node.children.componentChildren[key], material, node.texture.texture, node.texture.length_s, node.texture.length_t);
              }
          }
          else {
              if (node.texture.texture == "inherit") {
                  if (node.texture.length_s == null && node.texture.length_t == null) {
                      this.displayNode(node.children.componentChildren[key], node.materials[this.currMaterial%node.materials.length], texture, length_s, length_t);
                  }
                  else if (node.texture.length_t == null) {
                      this.displayNode(node.children.componentChildren[key], node.materials[this.currMaterial%node.materials.length], texture, node.texture.length_s, length_t);
                  }
                  else if (node.texture.length_s == null) {
                      this.displayNode(node.children.componentChildren[key], node.materials[this.currMaterial%node.materials.length], texture, length_s, node.texture.length_t);
                  }
                  else {
                      this.displayNode(node.children.componentChildren[key], node.materials[this.currMaterial%node.materials.length], texture, node.texture.length_s, node.texture.length_t);
                  }
              }
              else if (node.texture.texture == "none") {
                  this.displayNode(node.children.componentChildren[key], node.materials[this.currMaterial%node.materials.length], null, length_s, length_t);
              }
              else {
                  this.displayNode(node.children.componentChildren[key], node.materials[this.currMaterial%node.materials.length], node.texture.texture, node.texture.length_s, node.texture.length_t);
              }
          }
        }

        this.scene.popMatrix();
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        // Render loop starting at root of graph

        this.displayNode(this.components[this.idRoot], this.scene.defaultMaterial, null, 1, 1);
    }

}
