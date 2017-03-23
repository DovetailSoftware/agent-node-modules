/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = SourceNode; // circular dependency

var base64VLQ = require("./base64-vlq");
var getNumberOfLines = require("./helpers").getNumberOfLines;
var getUnfinishedLine = require("./helpers").getUnfinishedLine;
var SingleLineNode = require("./SingleLineNode");

function SourceNode(generatedCode, source, originalSource, startingLine) {
	this.generatedCode = generatedCode;
	this.originalSource = originalSource;
	this.source = source;
	this.startingLine = startingLine || 1;
	this._numberOfLines = getNumberOfLines(this.generatedCode);
}

SourceNode.prototype.clone = function() {
	return new SourceNode(this.generatedCode, this.source, this.originalSource, this.startingLine);
}

var LINE_MAPPING = ";AACA";

SourceNode.prototype.getGeneratedCode = function() {
	return this.generatedCode;
};

SourceNode.prototype.addGeneratedCode = function(code) {
	this.generatedCode += code;
	this._numberOfLines += getNumberOfLines(code);
};

SourceNode.prototype.getMappings = function(mappingsContext) {
	if(!this.generatedCode)
		return "";
	var lines = this._numberOfLines;
	var sourceIdx = mappingsContext.ensureSource(this.source, this.originalSource);
	var mappings = "A"; // generated column 0
	if(mappingsContext.unfinishedGeneratedLine)
		mappings = "," + base64VLQ.encode(mappingsContext.unfinishedGeneratedLine);
	mappings += base64VLQ.encode(sourceIdx - mappingsContext.currentSource); // source index
	mappings += base64VLQ.encode(this.startingLine - mappingsContext.currentOriginalLine); // original line index
	mappings += "A"; // original column 0
	mappingsContext.currentSource = sourceIdx;
	mappingsContext.currentOriginalLine = (lines || 1) + this.startingLine - 1;
	var unfinishedGeneratedLine = mappingsContext.unfinishedGeneratedLine = getUnfinishedLine(this.generatedCode)
	mappings += Array(lines).join(LINE_MAPPING);
	if(unfinishedGeneratedLine === 0) {
		mappings += ";";
	} else {
		if(lines !== 0) {
			mappings += LINE_MAPPING;
			mappingsContext.currentOriginalLine++;
		}
	}
	return mappings;
};

SourceNode.prototype.mapGeneratedCode = function(fn) {
	throw new Error("Cannot map generated code on a SourceMap. Normalize to SingleLineNode first.");
};

SourceNode.prototype.getNormalizedNodes = function() {
	var results = [];
	var currentLine = this.startingLine;
	var generatedCode = this.generatedCode;
	var index = 0;
	var indexEnd = generatedCode.length;
	while(index < indexEnd) {
		// get one generated line
		var nextLine = generatedCode.indexOf("\n", index) + 1;
		if(nextLine === 0) nextLine = indexEnd;
		var lineGenerated = generatedCode.substr(index, nextLine - index);

		results.push(new SingleLineNode(lineGenerated, this.source, this.originalSource, currentLine));

		// move cursors
		index = nextLine;
		currentLine++;
	}
	return results;
};

SourceNode.prototype.merge = function merge(otherNode) {
	if(otherNode instanceof SourceNode &&
		this.source === otherNode.source &&
		this.generatedCode[this.generatedCode.length - 1] === "\n" &&
		this.startingLine + this._numberOfLines === otherNode.startingLine) {
		this.generatedCode += otherNode.generatedCode;
		this._numberOfLines += otherNode._numberOfLines;
		return this;
	} else if(otherNode instanceof SingleLineNode &&
		this.source === otherNode.source) {
		if(this.generatedCode[this.generatedCode.length - 1] === "\n" &&
			this.startingLine + this._numberOfLines === otherNode.line &&
			otherNode._numberOfLines <= 1) {
			this.generatedCode += otherNode.generatedCode;
			this._numberOfLines += otherNode._numberOfLines
			return this;
		}
	}
	return false;
};
