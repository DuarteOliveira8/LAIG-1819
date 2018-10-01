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

        // <TEXTURES>
        if ((index = nodeNames.indexOf("TEXTURES")) == -1)
            return "tag <TEXTURES> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <TEXTURES> out of order");

            //Parse TEXTURES block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <MATERIALS>
        if ((index = nodeNames.indexOf("MATERIALS")) == -1)
            return "tag <MATERIALS> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <MATERIALS> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <NODES>
        if ((index = nodeNames.indexOf("NODES")) == -1)
            return "tag <NODES> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <NODES> out of order");

            //Parse NODES block
            if ((error = this.parseNodes(nodes[index])) != null)
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

        if (axisLength < 1.0) {
            axisLength = 1;
            return "Axis length is too small.";
        }

        this.axisCoords['x'] = [axisLength, 0, 0];
        this.axisCoords['y'] = [0, axisLength, 0];
        this.axisCoords['z'] = [0, 0, axisLength];

        return null;
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
        this.views["ortho"] = {};

        var indexPerspective = nodeNames.indexOf("perspective");
        var indexOrtho = nodeNames.indexOf("ortho");

        if (indexPerspective != -1) {
            this.views["perspective"] = {};

            var near, far, angle;

            near = this.reader.getFloat(children[indexPerspective], 'near');
            if (near == null || isNaN(near)) {
                near = 1;
                return "Near element must not be null."
            }

            far = this.reader.getFloat(children[indexPerspective], 'far');
            if (far == null || isNaN(far)) {
                far = 10;
                return "Far element must not be null."
            }
            else if (near >= far)
                return '"near" must be smaller than "far"';

            angle = this.reader.getFloat(children[indexPerspective], 'angle');
            if (angle == null || isNaN(angle)) {
                angle = 0;
                return "Angle element must not be null."
            }

            var range = children[indexPerspective].children;

            var rangeNames = [];

            for (var i = 0; i < range.length; i++)
                rangeNames.push(range.nodeName);

            if (range.getElementsByTagName('from').length != 1)
                return 'one and only one "from" tag must be defined';

            if (range.getElementsByTagName('to').length != 1)
                return 'one and only one "to" tag must be defined';

            var indexFrom = rangeNames.indexOf("perspective");
            var indexTo = rangeNames.indexOf("ortho");

            var from = {}, to = {};
            
            from.x = this.reader.getFloat(range[j], 'x');
            from.y = this.reader.getFloat(range[j], 'y');
            from.z = this.reader.getFloat(range[j], 'z');

            if (from.x == null || from.y == null || from.z == null) {
                from.x = 0;
                from.y = 0;
                from.z = 0;
                return "x, y and z can't be null.";
            }
            if (isNaN(from.x) || isNaN(from.y) || isNaN(from.z)) {
                from.x = 0;
                from.y = 0;
                from.z = 0;
                return "x, y and z can't be null.";
            }
        }

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName == "perspective") {
                var range = children[i].children;

                if ((range[0].nodeName == "from" && range[1].nodeName == "from") || (range[0].nodeName == "to" && range[1].nodeName == "to")) {
                    return 'You must have "from" and to "tags".';
                }

                var from = {}, to = {};

                for (var j = 0; j < range.length; j++) {
                    if (range[j].nodeName == "from") {
                        from.x = this.reader.getFloat(range[j], 'x');
                        from.y = this.reader.getFloat(range[j], 'y');
                        from.z = this.reader.getFloat(range[j], 'z');

                        if (from.x == null || from.y == null || from.z == null) {
                            from.x = 0;
                            from.y = 0;
                            from.z = 0;
                            return "x, y and z can't be null.";
                        }
                        if (isNaN(from.x) || isNaN(from.y) || isNaN(from.z)) {
                            from.x = 0;
                            from.y = 0;
                            from.z = 0;
                            return "x, y and z can't be null.";
                        }
                    }
                    else if (range[j].nodeName == "to") {
                        to.x = this.reader.getFloat(range[j], 'x');
                        to.y = this.reader.getFloat(range[j], 'y');
                        to.z = this.reader.getFloat(range[j], 'z');

                        if (to.x == null || to.y == null || to.z == null) {
                            to.x = 0;
                            to.y = 0;
                            to.z = 0;
                            return "x, y and z can't be null.";
                        }
                        if (isNaN(to.x) || isNaN(to.y) || isNaN(to.z)) {
                            to.x = 0;
                            to.y = 0;
                            to.z = 0;
                            return "x, y and z can't be null.";
                        }
                    }
                }

                this.views["perspective"].from = from;
                this.views["perspective"].to = to;
            }
            else if (children[i].nodeName == "ortho") {
                var near, far, bottom, top, left, right;

                near = this.reader.getFloat(children[i], 'near');
                if (near == null || isNaN(near)) {
                    near = 1;
                    return "Near element must not be null."
                }

                far = this.reader.getFloat(children[i], 'far');
                if (far == null || isNaN(far)) {
                    far = 1;
                    return "Far element must not be null."
                }
                else if (near >= far)
                    return '"near" must be smaller than "far"';

                bottom = this.reader.getFloat(children[i], 'bottom');
                if (bottom == null || isNaN(bottom)) {
                    bottom = 1;
                    return "Bottom element must not be null."
                }

                top = this.reader.getFloat(children[i], 'top');
                if (top == null || isNaN(top)) {
                    top = 1;
                    return "Top element must not be null."
                }
                else if (bottom >= top)
                    return '"bottom" must be smaller than "top"';

                left = this.reader.getFloat(children[i], 'left');
                if (left == null || isNaN(left)) {
                    left = 1;
                    return "Left element must not be null."
                }

                right = this.reader.getFloat(children[i], 'right');
                if (right == null || isNaN(right)) {
                    right = 1;
                    return "Right element must not be null."
                }
                else if (left >= right)
                    return '"left" must be smaller than "right"';

                this.views["ortho"].near = near;
                this.views["ortho"].far = far;
                this.views["ortho"].bottom = bottom;
                this.views["ortho"].top = top;
                this.views["ortho"].left = left;
                this.views["ortho"].right = right;
            }
            else {
                return "Node name error."
            }
        }
    }

    parseAmbient(ambientNode) {
        var children = ambientNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);
    }

    /**
     * Parses the <INITIALS> block.
     */
    parseInitials(initialsNode) {

        var children = initialsNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Frustum planes
        // (default values)
        this.near = 0.1;
        this.far = 500;
        var indexFrustum = nodeNames.indexOf("frustum");
        if (indexFrustum == -1) {
            this.onXMLMinorError("frustum planes missing; assuming 'near = 0.1' and 'far = 500'");
        }
        else {
            this.near = this.reader.getFloat(children[indexFrustum], 'near');
            this.far = this.reader.getFloat(children[indexFrustum], 'far');

            if (!(this.near != null && !isNaN(this.near))) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            }
            else if (!(this.far != null && !isNaN(this.far))) {
                this.far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            }

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";
        }

        // Checks if at most one translation, three rotations, and one scaling are defined.
        if (initialsNode.getElementsByTagName('translation').length > 1)
            return "no more than one initial translation may be defined";

        if (initialsNode.getElementsByTagName('rotation').length > 3)
            return "no more than three initial rotations may be defined";

        if (initialsNode.getElementsByTagName('scale').length > 1)
            return "no more than one scaling may be defined";

        // Initial transforms.
        this.initialTranslate = [];
        this.initialScaling = [];
        this.initialRotations = [];

        // Gets indices of each element.
        var translationIndex = nodeNames.indexOf("translation");
        var thirdRotationIndex = nodeNames.indexOf("rotation");
        var secondRotationIndex = nodeNames.indexOf("rotation", thirdRotationIndex + 1);
        var firstRotationIndex = nodeNames.lastIndexOf("rotation");
        var scalingIndex = nodeNames.indexOf("scale");

        // Checks if the indices are valid and in the expected order.
        // Translation.
        this.initialTransforms = mat4.create();
        mat4.identity(this.initialTransforms);

        if (translationIndex == -1)
            this.onXMLMinorError("initial translation undefined; assuming T = (0, 0, 0)");
        else {
            var tx = this.reader.getFloat(children[translationIndex], 'x');
            var ty = this.reader.getFloat(children[translationIndex], 'y');
            var tz = this.reader.getFloat(children[translationIndex], 'z');

            if (tx == null || ty == null || tz == null) {
                tx = 0;
                ty = 0;
                tz = 0;
                this.onXMLMinorError("failed to parse coordinates of initial translation; assuming zero");
            }

            //TODO: Save translation data
        }

        //TODO: Parse Rotations

        //TODO: Parse Scaling

        //TODO: Parse Reference length

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <ILLUMINATION> block.
     * @param {illumination block element} illuminationNode
     */
    parseIllumination(illuminationNode) {
        // TODO: Parse Illumination node

        this.log("Parsed illumination");

        return null;
    }


    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "LIGHT") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // TODO: Retrieve the diffuse component

            // TODO: Retrieve the specular component

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <TEXTURES> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // TODO: Parse block

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <NODES> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        // TODO: Parse block
        this.log("Parsed nodes");
        return null;
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
