# bpmn-js-embedded-comments

An extension for [bpmn-js](https://github.com/bpmn-io/bpmn-js) that allows you to comment on a BPMN 2.0 diagram. 

Stores the comments within the BPMN 2.0 XML file.

![A screenshot of a comments integration](https://raw.githubusercontent.com/bpmn-io/bpmn-js-embedded-comments/master/docs/screenshot.png)


## How comments are stored

Comments are read, added and written to an elements `<bpmn:documentation textFormat="text/x-comments" />` tag.

The format for comments is assumed to be

```
author:comment;
;other-author:other comment
canbe multiline, too
```

## License

MIT
