var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
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
     */
    parseScene(sceneNode) {
        var axisLength = this.reader.getFloat(sceneNode, 'axis_length');

        if (axisLength == null || isNaN(axisLength)) {
            axisLength = 1;
            return "Axis length can't be null.";
        }

        if (axisLength <= 0) {
            axisLength = 1;
            return "Axis length is too small.";
        }

        this.axisCoords['x'] = [axisLength, 0, 0];
        this.axisCoords['y'] = [0, axisLength, 0];
        this.axisCoords['z'] = [0, 0, axisLength];
    }

    /**
     * Parses the <views> block.
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        if (viewsNode.getElementsByTagName('perspective').length > 1)
            return "no more than one perspective may be defined";

        if (viewsNode.getElementsByTagName('ortho').length > 1)
            return "no more than one ortho view may be defined";

        if (viewsNode.getElementsByTagName('perspective').length == 0 && viewsNode.getElementsByTagName('ortho').length == 0)
            return "at least one view (perspective or ortho) must be defined";

        this.views = [];
        this.views.camera = [];

        var defaultCam = this.reader.getString(viewsNode, 'default');
        if (defaultCam == null || defaultCam == "") {
            return "Default element must not be null.";
        }

        this.views.defaultCam = defaultCam;

        var indexPerspective = nodeNames.indexOf("perspective");
        var indexOrtho = nodeNames.indexOf("ortho");

        if (indexPerspective != -1 && indexOrtho != -1) {
            if (this.reader.getString(children[indexPerspective], 'id') == this.reader.getString(children[indexOrtho], 'id'))
                return "Perspective id can't be equal to the Ortho id.";
        }

        if (indexPerspective != -1) {
            this.views.camera["perspective"] = [];

            var id, near, far, angle;

            id = this.reader.getString(children[indexPerspective], 'id');
            if (id == null || id == "") {
                id = "perspective";
                return "Id element must not be null.";
            }

            near = this.reader.getFloat(children[indexPerspective], 'near');
            if (near == null || isNaN(near)) {
                near = 1;
                return "Near element must not be null.";
            }

            far = this.reader.getFloat(children[indexPerspective], 'far');
            if (far == null || isNaN(far)) {
                far = 10;
                return "Far element must not be null.";
            }
            else if (near >= far)
                return '"near" must be smaller than "far"';

            angle = this.reader.getFloat(children[indexPerspective], 'angle');
            if (angle == null || isNaN(angle)) {
                angle = 0;
                return "Angle element must not be null.";
            }

            var range = children[indexPerspective].children;

            var rangeNames = [];

            for (var i = 0; i < range.length; i++)
                rangeNames.push(range[i].nodeName);

            if (children[indexPerspective].getElementsByTagName('from').length != 1)
                return 'one and only one "from" tag must be defined';

            if (children[indexPerspective].getElementsByTagName('to').length != 1)
                return 'one and only one "to" tag must be defined';

            var indexFrom = rangeNames.indexOf("from");
            var indexTo = rangeNames.indexOf("to");

            var from = [], to = [];

            from.x = this.reader.getFloat(range[indexFrom], 'x');
            from.y = this.reader.getFloat(range[indexFrom], 'y');
            from.z = this.reader.getFloat(range[indexFrom], 'z');

            if (from.x == null || from.y == null || from.z == null || isNaN(from.x) || isNaN(from.y) || isNaN(from.z)) {
                from.x = 0;
                from.y = 0;
                from.z = 0;
                return "x, y and z can't be null.";
            }

            to.x = this.reader.getFloat(range[indexTo], 'x');
            to.y = this.reader.getFloat(range[indexTo], 'y');
            to.z = this.reader.getFloat(range[indexTo], 'z');

            if (to.x == null || to.y == null || to.z == null || isNaN(to.x) || isNaN(to.y) || isNaN(to.z)) {
                to.x = 0;
                to.y = 0;
                to.z = 0;
                return "x, y and z can't be null.";
            }

            this.views.camera["perspective"].id = id;
            this.views.camera["perspective"].near = near;
            this.views.camera["perspective"].far = far;
            this.views.camera["perspective"].angle = angle;
            this.views.camera["perspective"].from = from;
            this.views.camera["perspective"].to = to;
        }

        if (indexOrtho != -1) {
            this.views.camera["ortho"] = [];

            var id, near, far, bottom, top, left, right;

            id = this.reader.getString(children[indexOrtho], 'id');
            if (id == null || id == "") {
                id = "ortho";
                return "Id element must not be null.";
            }

            near = this.reader.getFloat(children[indexOrtho], 'near');
            if (near == null || isNaN(near)) {
                near = 1;
                return "Near element must not be null.";
            }

            far = this.reader.getFloat(children[indexOrtho], 'far');
            if (far == null || isNaN(far)) {
                far = 1;
                return "Far element must not be null.";
            }
            else if (near >= far)
                return '"near" must be smaller than "far"';

            bottom = this.reader.getFloat(children[indexOrtho], 'bottom');
            if (bottom == null || isNaN(bottom)) {
                bottom = 1;
                return "Bottom element must not be null.";
            }

            top = this.reader.getFloat(children[indexOrtho], 'top');
            if (top == null || isNaN(top)) {
                top = 1;
                return "Top element must not be null.";
            }
            else if (bottom >= top)
                return '"bottom" must be smaller than "top"';

            left = this.reader.getFloat(children[indexOrtho], 'left');
            if (left == null || isNaN(left)) {
                left = 1;
                return "Left element must not be null.";
            }

            right = this.reader.getFloat(children[indexOrtho], 'right');
            if (right == null || isNaN(right)) {
                right = 1;
                return "Right element must not be null."
            }
            else if (left >= right)
                return '"left" must be smaller than "right"';

            this.views.camera["ortho"].id = id;
            this.views.camera["ortho"].near = near;
            this.views.camera["ortho"].far = far;
            this.views.camera["ortho"].bottom = bottom;
            this.views.camera["ortho"].top = top;
            this.views.camera["ortho"].left = left;
            this.views.camera["ortho"].right = right;
        }
    }

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
            this.ambient["ambient"] = [];

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

            this.ambient["ambient"].r = r;
            this.ambient["ambient"].g = g;
            this.ambient["ambient"].b = b;
            this.ambient["ambient"].a = a;
        }

        if (indexBackground != -1) {
            this.ambient["background"] = [];

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

            this.ambient["background"].r = r;
            this.ambient["background"].g = g;
            this.ambient["background"].b = b;
            this.ambient["background"].a = a;
        }
    }

    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        this.lights["omni"] = [];
        this.lights["spot"] = [];

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

            for (var k = 0; k < this.lights.omni.length; k++) {
                if (id == this.lights.omni[k].id)
                    return "Id element must be unique for each light (Duplicate: " + id + ")";
            }

            for (var k = 0; k < this.lights.spot.length; k++) {
                if (id == this.lights.spot[k].id)
                    return "Id element must be unique for each light (Duplicate: " + id + ")";
            }

            enabled = this.reader.getInteger(children[i], 'enabled');
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

            if (children[i].nodeName == "spot") {
                //save spot specifics
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

                light.id = id;
                light.enabled = enabled;
                light.angle = angle;
                light.exponent = exponent;
                light.location = location;
                light.target = target;
                light.ambient = ambient;
                light.diffuse = diffuse;
                light.specular = specular;

                this.lights["spot"].push(light);
            }
            else if (children[i].nodeName == "omni") {
                //save omni specifics
                light.id = id;
                light.enabled = enabled;
                light.location = location;
                light.ambient = ambient;
                light.diffuse = diffuse;
                light.specular = specular;

                this.lights["omni"].push(light);
            }
        }
    }

    parseTextures(texturesNode) {
        var children = texturesNode.children;

        this.textures = [];

        if (texturesNode.getElementsByTagName('texture').length < 1)
            return 'at least one "texture" tag must be defined';

        for (var i = 0; i < children.length; i++) {
            var texture = [];

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var id, file;

            id = this.reader.getString(children[i], 'id');
            if (id == null || id == "") {
                id = i;
                return "Id element must not be null.";
            }

            for (var j = 0; j < this.textures.length; j++) {
                if (id == this.textures[j].id)
                    return "Id element must be unique for each texture. (Duplicate: " + id + ")";
            }

            file = this.reader.getString(children[i], 'file');
            if (file == null || file == "") {
                return "File name is not valid.";
            }

            texture.id = id;
            texture.file = file;
            this.textures.push(texture);
        }
    }

    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        if(materialsNode.getElementsByTagName('material').length < 1)
            return 'at least one "material" tag must be defined';

        for (var i = 0; i < children.length; i++) {

            var material = [];
            var specular = [], diffuse = [], ambient = [], emission = [];
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

            for (var j = 0; j < this.materials.length; j++) {
                if (id == this.materials[j].id)
                    return "Id element must be unique for each material. (Duplicate: " + id + ")";
            }

            shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null || shininess == "") {
                return "Shininess value must not be null.";
            }
            else if (shininess < 0) {
                return "Shininess value must be higher than 0.";
            }

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

                specular.push(r);
                specular.push(g);
                specular.push(b);
                specular.push(a);
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

                diffuse.push(r);
                diffuse.push(g);
                diffuse.push(b);
                diffuse.push(a);
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

                ambient.push(r);
                ambient.push(g);
                ambient.push(b);
                ambient.push(a);
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

                emission.push(r);
                emission.push(g);
                emission.push(b);
                emission.push(a);
            }
            else {
                return "Emission must be defined."
            }

            material.id = id;
            material.shininess = shininess;
            material.specular = specular;
            material.diffuse = diffuse;
            material.ambient = ambient;
            material.emission = emission;

            this.materials.push(material);
        }
    }

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

            var transformation = [];
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

            for (var j = 0; j < this.transformations.length; j++) {
                if (id == this.transformations[j].id)
                    return "Id element must be unique for each transformation. (Duplicate: " + id + ")";
            }

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

            transformation.id = id;
            transformation.instructions = instructions;

            this.transformations.push(transformation);
        }
    }

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

            for (var j = 0; j < this.primitives.length; j++) {
                if (id == this.primitives[j].id)
                    return "Id element must be unique for each primitive. (Duplicate: " + id + ")";
            }

            if(attrs[0].nodeName == "cylinder") {
                var type = "cylinder", base, top, height, slices, stacks;

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

                primitive.id = id;
                primitive.type = type;
                primitive.base = base;
                primitive.top = top;
                primitive.height = height;
                primitive.slices = slices;
                primitive.stacks = stacks;
            }

            else if (attrs[0].nodeName == "rectangle") {
                var type = "rectangle", x1, y1, x2, y2;

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

                primitive.id = id;
                primitive.type = type;
                primitive.x1 = x1;
                primitive.y1 = y1;
                primitive.x2 = x2;
                primitive.y2 = y2;
            }


            else if (attrs[0].nodeName == "triangle") {
                var type = "triangle", x1, y1, z1, x2, y2, z2, x3, y3, z3;

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

                primitive.id = id;
                primitive.type = type;
                primitive.x1 = x1;
                primitive.y1 = y1;
                primitive.z1 = z1;
                primitive.x2 = x2;
                primitive.y2 = y2;
                primitive.z2 = z2;
                primitive.x3 = x3;
                primitive.y3 = y3;
                primitive.z3 = z3;
            }


            else if (attrs[0].nodeName == "sphere") {
                var type = "sphere", radius, slices, stacks;

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

                primitive.id = id;
                primitive.type = type;
                primitive.radius = radius;
                primitive.slices = slices;
                primitive.stacks = stacks;
            }


            else if (attrs[0].nodeName == "torus") {
                var type = "torus", inner, outer, slices, loops;

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

                primitive.id = id;
                primitive.type = type;
                primitive.inner = inner;
                primitive.outer = outer;
                primitive.slices = slices;
                primitive.loops = loops;
            }
            else {
              this.onXMLMinorError("unknown tag <" + attrs[0].nodeName + ">");
            }

            this.primitives.push(primitive);
        }
    }

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

            for (var j = 0; j < this.components.length; j++) {
                if (id == this.components[j].id)
                    return "Id element must be unique for each component. (Duplicate: " + id + ")";
            }

            var attrNames = [];

            for (var j = 0; j < attrs.length; j++)
                attrNames.push(attrs[j].nodeName);

            if (children[i].getElementsByTagName('transformation').length > 1)
                return "no more than one transformation may be defined";

            if (children[i].getElementsByTagName('materials').length > 1)
                return "no more than one materials tag may be defined";

            if (children[i].getElementsByTagName('texture').length > 1)
                return "no more than one texture may be defined";

            if (children[i].getElementsByTagName('children').length > 1)
                return "no more than one children tag may be defined";

            if (attrs.length > 4) {
                return "only 4 tags may be defined";
            }

            var indexTransformation = attrNames.indexOf("transformation");
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
                    var transformationRef, transformationId;

                    transformationId = this.reader.getString(ref, 'id');
                    if (transformationId == null || transformationId == "") {
                        transformationId = i;
                        return "Id element must not be null.";
                    }

                    var exists = false;
                    for (var k = 0; k < this.transformations.length; k++) {
                        if (this.transformations[k].id == transformationId) {
                            transformationRef = this.transformations[k];
                            exists = true;
                        }
                    }

                    if (!exists) {
                        return "The transformation with the id '" + transformationId +  "' doesn't exist.";
                    }

                    component.transformation = transformationRef;
                }
                else {
                    return "no more than one transformationref tag may be defined";
                }
            }
            else {
                return "transformation tag is missing";
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

                    var exists = false;
                    for (var k = 0; k < this.materials.length; k++) {
                        if (this.materials[k].id == materialId) {
                            material = this.materials[k];
                            exists = true;
                        }
                    }

                    if (!exists) {
                        return "The material with the id '" + materialId +  "' doesn't exist.";
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

                if (textureId == "none") {
                    textureRef = "none";
                }
                else if (textureId == "inherit") {
                    textureRef = "inherit";
                }
                else {
                    var exists = false;
                    for (var k = 0; k < this.textures.length; k++) {
                        if (this.textures[k].id == textureId) {
                            textureRef = this.textures[k];
                            exists = true;
                        }
                    }

                    if (!exists) {
                        return "The texture with the id '" + textureId +  "' doesn't exist.";
                    }
                }

                length_s = this.reader.getFloat(textureNode, 'length_s');
                if (length_s == null || isNaN(length_s)) {
                    length_s = 1;
                    return '"length_s" element must not be null. Assuming length_s=1';
                }

                length_t = this.reader.getFloat(textureNode, 'length_t');
                if (length_t == null || isNaN(length_t)) {
                    length_t = 1;
                    return '"length_t" element must not be null. Assuming length_t=1';
                }

                texture.texture = textureRef;
                texture.length_s = length_s;
                texture.length_t = length_t;

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
                        var primitiveRef;

                        var exists = false;
                        for (var k = 0; k < this.primitives.length; k++) {
                            if (this.primitives[k].id == childrenId) {
                                primitiveRef = this.primitives[k];
                                exists = true;
                            }
                        }

                        if (!exists) {
                            return "The primitive with the id '" + childrenId +  "' doesn't exist.";
                        }

                        primitiveChildren.push(primitiveRef);
                    }
                }

                childrenContainer.componentChildren = componentChildren;
                childrenContainer.primitiveChildren = primitiveChildren;

                component.children = childrenContainer;
            }
            else {
                return "children tag missing";
            }

            component.id = id;

            this.components.push(component);
        }

        for (var i = 0; i < this.components.length; i++)
            for (var j = 0; j < this.components[i].children.componentChildren.length; j++)
                for (var k = 0; k < this.components.length; k++)
                    if (this.components[k].id == this.components[i].children.componentChildren[j])
                        this.components[i].children.componentChildren[j] = this.components[k];
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
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}
