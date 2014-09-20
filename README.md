# omments for bpmn-js

This project adds the ability create comments on elements to [bpmn-js](https://github.com/bpmn-io/bpmn-js).

Comments are read, added and written to an elements `<bpmn:documentation textFormat="text/x-comments" />` tag.

The format for comments is assumed to be

```
author:comment;
;other-author:other comment
canbe multiline, too
```

## License

MIT