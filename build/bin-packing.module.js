/******************************************************************************

This is a binary tree based bin packing algorithm that is more complex than
the simple Packer (packer.js). Instead of starting off with a fixed width and
height, it starts with the width and height of the first block passed and then
grows as necessary to accomodate each subsequent block. As it grows it attempts
to maintain a roughly square ratio by making 'smart' choices about whether to
grow right or down.

When growing, the algorithm can only grow to the right OR down. Therefore, if
the new block is BOTH wider and taller than the current target then it will be
rejected. This makes it very important to initialize with a sensible starting
width and height. If you are providing sorted input (largest first) then this
will not be an issue.

A potential way to solve this limitation would be to allow growth in BOTH
directions at once, but this requires maintaining a more complex tree
with 3 children (down, right and center) and that complexity can be avoided
by simply chosing a sensible starting block.

Best results occur when the input blocks are sorted by height, or even better
when sorted by max(width,height).

Inputs:
------

  blocks: array of any objects that have .w and .h attributes

Outputs:
-------

  marks each block that fits with a .fit attribute pointing to a
  node with .x and .y coordinates

Example:
-------

  var blocks = [
    { w: 100, h: 100 },
    { w: 100, h: 100 },
    { w:  80, h:  80 },
    { w:  80, h:  80 },
    etc
    etc
  ];

  var packer = new GrowingPacker();
  packer.fit(blocks);

  for(var n = 0 ; n < blocks.length ; n++) {
    var block = blocks[n];
    if (block.fit) {
      Draw(block.fit.x, block.fit.y, block.w, block.h);
    }
  }


******************************************************************************/

function GrowingPacker() {}

GrowingPacker.prototype = {

  fit: function fit(blocks) {
    var n,
        node,
        block,
        len = blocks.length;
    var w = len > 0 ? blocks[0].w : 0;
    var h = len > 0 ? blocks[0].h : 0;
    this.root = { x: 0, y: 0, w: w, h: h };
    for (n = 0; n < len; n++) {
      block = blocks[n];
      if (node = this.findNode(this.root, block.w, block.h)) block.fit = this.splitNode(node, block.w, block.h);else block.fit = this.growNode(block.w, block.h);
    }
  },

  findNode: function findNode(root, w, h) {
    if (root.used) return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);else if (w <= root.w && h <= root.h) return root;else return null;
  },

  splitNode: function splitNode(node, w, h) {
    node.used = true;
    node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
    node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
    return node;
  },

  growNode: function growNode(w, h) {
    var canGrowDown = w <= this.root.w;
    var canGrowRight = h <= this.root.h;

    var shouldGrowRight = canGrowRight && this.root.h >= this.root.w + w; // attempt to keep square-ish by growing right when height is much greater than width
    var shouldGrowDown = canGrowDown && this.root.w >= this.root.h + h; // attempt to keep square-ish by growing down  when width  is much greater than height

    if (shouldGrowRight) return this.growRight(w, h);else if (shouldGrowDown) return this.growDown(w, h);else if (canGrowRight) return this.growRight(w, h);else if (canGrowDown) return this.growDown(w, h);else return null; // need to ensure sensible root starting size to avoid this happening
  },

  growRight: function growRight(w, h) {
    var node;
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w + w,
      h: this.root.h,
      down: this.root,
      right: { x: this.root.w, y: 0, w: w, h: this.root.h }
    };
    if (node = this.findNode(this.root, w, h)) return this.splitNode(node, w, h);else return null;
  },

  growDown: function growDown(w, h) {
    var node;
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w,
      h: this.root.h + h,
      down: { x: 0, y: this.root.h, w: this.root.w, h: h },
      right: this.root
    };
    if (node = this.findNode(this.root, w, h)) return this.splitNode(node, w, h);else return null;
  }

};

/******************************************************************************

This is a very simple binary tree based bin packing algorithm that is initialized
with a fixed width and height and will fit each block into the first node where
it fits and then split that node into 2 parts (down and right) to track the
remaining whitespace.

Best results occur when the input blocks are sorted by height, or even better
when sorted by max(width,height).

Inputs:
------

  w:       width of target rectangle
  h:      height of target rectangle
  blocks: array of any objects that have .w and .h attributes

Outputs:
-------

  marks each block that fits with a .fit attribute pointing to a
  node with .x and .y coordinates

Example:
-------

  var blocks = [
    { w: 100, h: 100 },
    { w: 100, h: 100 },
    { w:  80, h:  80 },
    { w:  80, h:  80 },
    etc
    etc
  ];

  var packer = new Packer(500, 500);
  packer.fit(blocks);

  for(var n = 0 ; n < blocks.length ; n++) {
    var block = blocks[n];
    if (block.fit) {
      Draw(block.fit.x, block.fit.y, block.w, block.h);
    }
  }


******************************************************************************/

function Packer(w, h) {
  this.init(w, h);
}

Packer.prototype = {

  init: function init(w, h) {
    this.root = { x: 0, y: 0, w: w, h: h };
  },

  fit: function fit(blocks) {
    var n, node, block;
    for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
      if (node = this.findNode(this.root, block.w, block.h)) block.fit = this.splitNode(node, block.w, block.h);
    }
  },

  findNode: function findNode(root, w, h) {
    if (root.used) return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);else if (w <= root.w && h <= root.h) return root;else return null;
  },

  splitNode: function splitNode(node, w, h) {
    node.used = true;
    node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
    node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
    return node;
  }

};

export { GrowingPacker, Packer };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL2pzL3BhY2tlci5ncm93aW5nLmpzIiwiLi4vanMvcGFja2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuVGhpcyBpcyBhIGJpbmFyeSB0cmVlIGJhc2VkIGJpbiBwYWNraW5nIGFsZ29yaXRobSB0aGF0IGlzIG1vcmUgY29tcGxleCB0aGFuXG50aGUgc2ltcGxlIFBhY2tlciAocGFja2VyLmpzKS4gSW5zdGVhZCBvZiBzdGFydGluZyBvZmYgd2l0aCBhIGZpeGVkIHdpZHRoIGFuZFxuaGVpZ2h0LCBpdCBzdGFydHMgd2l0aCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgZmlyc3QgYmxvY2sgcGFzc2VkIGFuZCB0aGVuXG5ncm93cyBhcyBuZWNlc3NhcnkgdG8gYWNjb21vZGF0ZSBlYWNoIHN1YnNlcXVlbnQgYmxvY2suIEFzIGl0IGdyb3dzIGl0IGF0dGVtcHRzXG50byBtYWludGFpbiBhIHJvdWdobHkgc3F1YXJlIHJhdGlvIGJ5IG1ha2luZyAnc21hcnQnIGNob2ljZXMgYWJvdXQgd2hldGhlciB0b1xuZ3JvdyByaWdodCBvciBkb3duLlxuXG5XaGVuIGdyb3dpbmcsIHRoZSBhbGdvcml0aG0gY2FuIG9ubHkgZ3JvdyB0byB0aGUgcmlnaHQgT1IgZG93bi4gVGhlcmVmb3JlLCBpZlxudGhlIG5ldyBibG9jayBpcyBCT1RIIHdpZGVyIGFuZCB0YWxsZXIgdGhhbiB0aGUgY3VycmVudCB0YXJnZXQgdGhlbiBpdCB3aWxsIGJlXG5yZWplY3RlZC4gVGhpcyBtYWtlcyBpdCB2ZXJ5IGltcG9ydGFudCB0byBpbml0aWFsaXplIHdpdGggYSBzZW5zaWJsZSBzdGFydGluZ1xud2lkdGggYW5kIGhlaWdodC4gSWYgeW91IGFyZSBwcm92aWRpbmcgc29ydGVkIGlucHV0IChsYXJnZXN0IGZpcnN0KSB0aGVuIHRoaXNcbndpbGwgbm90IGJlIGFuIGlzc3VlLlxuXG5BIHBvdGVudGlhbCB3YXkgdG8gc29sdmUgdGhpcyBsaW1pdGF0aW9uIHdvdWxkIGJlIHRvIGFsbG93IGdyb3d0aCBpbiBCT1RIXG5kaXJlY3Rpb25zIGF0IG9uY2UsIGJ1dCB0aGlzIHJlcXVpcmVzIG1haW50YWluaW5nIGEgbW9yZSBjb21wbGV4IHRyZWVcbndpdGggMyBjaGlsZHJlbiAoZG93biwgcmlnaHQgYW5kIGNlbnRlcikgYW5kIHRoYXQgY29tcGxleGl0eSBjYW4gYmUgYXZvaWRlZFxuYnkgc2ltcGx5IGNob3NpbmcgYSBzZW5zaWJsZSBzdGFydGluZyBibG9jay5cblxuQmVzdCByZXN1bHRzIG9jY3VyIHdoZW4gdGhlIGlucHV0IGJsb2NrcyBhcmUgc29ydGVkIGJ5IGhlaWdodCwgb3IgZXZlbiBiZXR0ZXJcbndoZW4gc29ydGVkIGJ5IG1heCh3aWR0aCxoZWlnaHQpLlxuXG5JbnB1dHM6XG4tLS0tLS1cblxuICBibG9ja3M6IGFycmF5IG9mIGFueSBvYmplY3RzIHRoYXQgaGF2ZSAudyBhbmQgLmggYXR0cmlidXRlc1xuXG5PdXRwdXRzOlxuLS0tLS0tLVxuXG4gIG1hcmtzIGVhY2ggYmxvY2sgdGhhdCBmaXRzIHdpdGggYSAuZml0IGF0dHJpYnV0ZSBwb2ludGluZyB0byBhXG4gIG5vZGUgd2l0aCAueCBhbmQgLnkgY29vcmRpbmF0ZXNcblxuRXhhbXBsZTpcbi0tLS0tLS1cblxuICB2YXIgYmxvY2tzID0gW1xuICAgIHsgdzogMTAwLCBoOiAxMDAgfSxcbiAgICB7IHc6IDEwMCwgaDogMTAwIH0sXG4gICAgeyB3OiAgODAsIGg6ICA4MCB9LFxuICAgIHsgdzogIDgwLCBoOiAgODAgfSxcbiAgICBldGNcbiAgICBldGNcbiAgXTtcblxuICB2YXIgcGFja2VyID0gbmV3IEdyb3dpbmdQYWNrZXIoKTtcbiAgcGFja2VyLmZpdChibG9ja3MpO1xuXG4gIGZvcih2YXIgbiA9IDAgOyBuIDwgYmxvY2tzLmxlbmd0aCA7IG4rKykge1xuICAgIHZhciBibG9jayA9IGJsb2Nrc1tuXTtcbiAgICBpZiAoYmxvY2suZml0KSB7XG4gICAgICBEcmF3KGJsb2NrLmZpdC54LCBibG9jay5maXQueSwgYmxvY2sudywgYmxvY2suaCk7XG4gICAgfVxuICB9XG5cblxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5mdW5jdGlvbiBHcm93aW5nUGFja2VyKCkgeyB9XG5cbkdyb3dpbmdQYWNrZXIucHJvdG90eXBlID0ge1xuXG4gIGZpdDogZnVuY3Rpb24oYmxvY2tzKSB7XG4gICAgdmFyIG4sIG5vZGUsIGJsb2NrLCBsZW4gPSBibG9ja3MubGVuZ3RoO1xuICAgIHZhciB3ID0gbGVuID4gMCA/IGJsb2Nrc1swXS53IDogMDtcbiAgICB2YXIgaCA9IGxlbiA+IDAgPyBibG9ja3NbMF0uaCA6IDA7XG4gICAgdGhpcy5yb290ID0geyB4OiAwLCB5OiAwLCB3OiB3LCBoOiBoIH07XG4gICAgZm9yIChuID0gMDsgbiA8IGxlbiA7IG4rKykge1xuICAgICAgYmxvY2sgPSBibG9ja3Nbbl07XG4gICAgICBpZiAobm9kZSA9IHRoaXMuZmluZE5vZGUodGhpcy5yb290LCBibG9jay53LCBibG9jay5oKSlcbiAgICAgICAgYmxvY2suZml0ID0gdGhpcy5zcGxpdE5vZGUobm9kZSwgYmxvY2sudywgYmxvY2suaCk7XG4gICAgICBlbHNlXG4gICAgICAgIGJsb2NrLmZpdCA9IHRoaXMuZ3Jvd05vZGUoYmxvY2sudywgYmxvY2suaCk7XG4gICAgfVxuICB9LFxuXG4gIGZpbmROb2RlOiBmdW5jdGlvbihyb290LCB3LCBoKSB7XG4gICAgaWYgKHJvb3QudXNlZClcbiAgICAgIHJldHVybiB0aGlzLmZpbmROb2RlKHJvb3QucmlnaHQsIHcsIGgpIHx8IHRoaXMuZmluZE5vZGUocm9vdC5kb3duLCB3LCBoKTtcbiAgICBlbHNlIGlmICgodyA8PSByb290LncpICYmIChoIDw9IHJvb3QuaCkpXG4gICAgICByZXR1cm4gcm9vdDtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICBzcGxpdE5vZGU6IGZ1bmN0aW9uKG5vZGUsIHcsIGgpIHtcbiAgICBub2RlLnVzZWQgPSB0cnVlO1xuICAgIG5vZGUuZG93biAgPSB7IHg6IG5vZGUueCwgICAgIHk6IG5vZGUueSArIGgsIHc6IG5vZGUudywgICAgIGg6IG5vZGUuaCAtIGggfTtcbiAgICBub2RlLnJpZ2h0ID0geyB4OiBub2RlLnggKyB3LCB5OiBub2RlLnksICAgICB3OiBub2RlLncgLSB3LCBoOiBoICAgICAgICAgIH07XG4gICAgcmV0dXJuIG5vZGU7XG4gIH0sXG5cbiAgZ3Jvd05vZGU6IGZ1bmN0aW9uKHcsIGgpIHtcbiAgICB2YXIgY2FuR3Jvd0Rvd24gID0gKHcgPD0gdGhpcy5yb290LncpO1xuICAgIHZhciBjYW5Hcm93UmlnaHQgPSAoaCA8PSB0aGlzLnJvb3QuaCk7XG5cbiAgICB2YXIgc2hvdWxkR3Jvd1JpZ2h0ID0gY2FuR3Jvd1JpZ2h0ICYmICh0aGlzLnJvb3QuaCA+PSAodGhpcy5yb290LncgKyB3KSk7IC8vIGF0dGVtcHQgdG8ga2VlcCBzcXVhcmUtaXNoIGJ5IGdyb3dpbmcgcmlnaHQgd2hlbiBoZWlnaHQgaXMgbXVjaCBncmVhdGVyIHRoYW4gd2lkdGhcbiAgICB2YXIgc2hvdWxkR3Jvd0Rvd24gID0gY2FuR3Jvd0Rvd24gICYmICh0aGlzLnJvb3QudyA+PSAodGhpcy5yb290LmggKyBoKSk7IC8vIGF0dGVtcHQgdG8ga2VlcCBzcXVhcmUtaXNoIGJ5IGdyb3dpbmcgZG93biAgd2hlbiB3aWR0aCAgaXMgbXVjaCBncmVhdGVyIHRoYW4gaGVpZ2h0XG5cbiAgICBpZiAoc2hvdWxkR3Jvd1JpZ2h0KVxuICAgICAgcmV0dXJuIHRoaXMuZ3Jvd1JpZ2h0KHcsIGgpO1xuICAgIGVsc2UgaWYgKHNob3VsZEdyb3dEb3duKVxuICAgICAgcmV0dXJuIHRoaXMuZ3Jvd0Rvd24odywgaCk7XG4gICAgZWxzZSBpZiAoY2FuR3Jvd1JpZ2h0KVxuICAgICByZXR1cm4gdGhpcy5ncm93UmlnaHQodywgaCk7XG4gICAgZWxzZSBpZiAoY2FuR3Jvd0Rvd24pXG4gICAgICByZXR1cm4gdGhpcy5ncm93RG93bih3LCBoKTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbnVsbDsgLy8gbmVlZCB0byBlbnN1cmUgc2Vuc2libGUgcm9vdCBzdGFydGluZyBzaXplIHRvIGF2b2lkIHRoaXMgaGFwcGVuaW5nXG4gIH0sXG5cbiAgZ3Jvd1JpZ2h0OiBmdW5jdGlvbih3LCBoKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgdGhpcy5yb290ID0ge1xuICAgICAgdXNlZDogdHJ1ZSxcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgdzogdGhpcy5yb290LncgKyB3LFxuICAgICAgaDogdGhpcy5yb290LmgsXG4gICAgICBkb3duOiB0aGlzLnJvb3QsXG4gICAgICByaWdodDogeyB4OiB0aGlzLnJvb3QudywgeTogMCwgdzogdywgaDogdGhpcy5yb290LmggfVxuICAgIH07XG4gICAgaWYgKG5vZGUgPSB0aGlzLmZpbmROb2RlKHRoaXMucm9vdCwgdywgaCkpXG4gICAgICByZXR1cm4gdGhpcy5zcGxpdE5vZGUobm9kZSwgdywgaCk7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgZ3Jvd0Rvd246IGZ1bmN0aW9uKHcsIGgpIHtcbiAgICB2YXIgbm9kZTtcbiAgICB0aGlzLnJvb3QgPSB7XG4gICAgICB1c2VkOiB0cnVlLFxuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICB3OiB0aGlzLnJvb3QudyxcbiAgICAgIGg6IHRoaXMucm9vdC5oICsgaCxcbiAgICAgIGRvd246ICB7IHg6IDAsIHk6IHRoaXMucm9vdC5oLCB3OiB0aGlzLnJvb3QudywgaDogaCB9LFxuICAgICAgcmlnaHQ6IHRoaXMucm9vdFxuICAgIH07XG4gICAgaWYgKG5vZGUgPSB0aGlzLmZpbmROb2RlKHRoaXMucm9vdCwgdywgaCkpXG4gICAgICByZXR1cm4gdGhpcy5zcGxpdE5vZGUobm9kZSwgdywgaCk7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cblxufVxuXG5leHBvcnQgeyBHcm93aW5nUGFja2VyIH1cbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuVGhpcyBpcyBhIHZlcnkgc2ltcGxlIGJpbmFyeSB0cmVlIGJhc2VkIGJpbiBwYWNraW5nIGFsZ29yaXRobSB0aGF0IGlzIGluaXRpYWxpemVkXG53aXRoIGEgZml4ZWQgd2lkdGggYW5kIGhlaWdodCBhbmQgd2lsbCBmaXQgZWFjaCBibG9jayBpbnRvIHRoZSBmaXJzdCBub2RlIHdoZXJlXG5pdCBmaXRzIGFuZCB0aGVuIHNwbGl0IHRoYXQgbm9kZSBpbnRvIDIgcGFydHMgKGRvd24gYW5kIHJpZ2h0KSB0byB0cmFjayB0aGVcbnJlbWFpbmluZyB3aGl0ZXNwYWNlLlxuXG5CZXN0IHJlc3VsdHMgb2NjdXIgd2hlbiB0aGUgaW5wdXQgYmxvY2tzIGFyZSBzb3J0ZWQgYnkgaGVpZ2h0LCBvciBldmVuIGJldHRlclxud2hlbiBzb3J0ZWQgYnkgbWF4KHdpZHRoLGhlaWdodCkuXG5cbklucHV0czpcbi0tLS0tLVxuXG4gIHc6ICAgICAgIHdpZHRoIG9mIHRhcmdldCByZWN0YW5nbGVcbiAgaDogICAgICBoZWlnaHQgb2YgdGFyZ2V0IHJlY3RhbmdsZVxuICBibG9ja3M6IGFycmF5IG9mIGFueSBvYmplY3RzIHRoYXQgaGF2ZSAudyBhbmQgLmggYXR0cmlidXRlc1xuXG5PdXRwdXRzOlxuLS0tLS0tLVxuXG4gIG1hcmtzIGVhY2ggYmxvY2sgdGhhdCBmaXRzIHdpdGggYSAuZml0IGF0dHJpYnV0ZSBwb2ludGluZyB0byBhXG4gIG5vZGUgd2l0aCAueCBhbmQgLnkgY29vcmRpbmF0ZXNcblxuRXhhbXBsZTpcbi0tLS0tLS1cblxuICB2YXIgYmxvY2tzID0gW1xuICAgIHsgdzogMTAwLCBoOiAxMDAgfSxcbiAgICB7IHc6IDEwMCwgaDogMTAwIH0sXG4gICAgeyB3OiAgODAsIGg6ICA4MCB9LFxuICAgIHsgdzogIDgwLCBoOiAgODAgfSxcbiAgICBldGNcbiAgICBldGNcbiAgXTtcblxuICB2YXIgcGFja2VyID0gbmV3IFBhY2tlcig1MDAsIDUwMCk7XG4gIHBhY2tlci5maXQoYmxvY2tzKTtcblxuICBmb3IodmFyIG4gPSAwIDsgbiA8IGJsb2Nrcy5sZW5ndGggOyBuKyspIHtcbiAgICB2YXIgYmxvY2sgPSBibG9ja3Nbbl07XG4gICAgaWYgKGJsb2NrLmZpdCkge1xuICAgICAgRHJhdyhibG9jay5maXQueCwgYmxvY2suZml0LnksIGJsb2NrLncsIGJsb2NrLmgpO1xuICAgIH1cbiAgfVxuXG5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZnVuY3Rpb24gUGFja2VyKHcsIGgpIHtcbiAgdGhpcy5pbml0KHcsIGgpO1xufTtcblxuUGFja2VyLnByb3RvdHlwZSA9IHtcblxuICBpbml0OiBmdW5jdGlvbih3LCBoKSB7XG4gICAgdGhpcy5yb290ID0geyB4OiAwLCB5OiAwLCB3OiB3LCBoOiBoIH07XG4gIH0sXG5cbiAgZml0OiBmdW5jdGlvbihibG9ja3MpIHtcbiAgICB2YXIgbiwgbm9kZSwgYmxvY2s7XG4gICAgZm9yIChuID0gMDsgbiA8IGJsb2Nrcy5sZW5ndGg7IG4rKykge1xuICAgICAgYmxvY2sgPSBibG9ja3Nbbl07XG4gICAgICBpZiAobm9kZSA9IHRoaXMuZmluZE5vZGUodGhpcy5yb290LCBibG9jay53LCBibG9jay5oKSlcbiAgICAgICAgYmxvY2suZml0ID0gdGhpcy5zcGxpdE5vZGUobm9kZSwgYmxvY2sudywgYmxvY2suaCk7XG4gICAgfVxuICB9LFxuXG4gIGZpbmROb2RlOiBmdW5jdGlvbihyb290LCB3LCBoKSB7XG4gICAgaWYgKHJvb3QudXNlZClcbiAgICAgIHJldHVybiB0aGlzLmZpbmROb2RlKHJvb3QucmlnaHQsIHcsIGgpIHx8IHRoaXMuZmluZE5vZGUocm9vdC5kb3duLCB3LCBoKTtcbiAgICBlbHNlIGlmICgodyA8PSByb290LncpICYmIChoIDw9IHJvb3QuaCkpXG4gICAgICByZXR1cm4gcm9vdDtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICBzcGxpdE5vZGU6IGZ1bmN0aW9uKG5vZGUsIHcsIGgpIHtcbiAgICBub2RlLnVzZWQgPSB0cnVlO1xuICAgIG5vZGUuZG93biAgPSB7IHg6IG5vZGUueCwgICAgIHk6IG5vZGUueSArIGgsIHc6IG5vZGUudywgICAgIGg6IG5vZGUuaCAtIGggfTtcbiAgICBub2RlLnJpZ2h0ID0geyB4OiBub2RlLnggKyB3LCB5OiBub2RlLnksICAgICB3OiBub2RlLncgLSB3LCBoOiBoICAgICAgICAgIH07XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxufVxuXG5leHBvcnQgeyBQYWNrZXIgfVxuIl0sIm5hbWVzIjpbIkdyb3dpbmdQYWNrZXIiLCJwcm90b3R5cGUiLCJibG9ja3MiLCJuIiwibm9kZSIsImJsb2NrIiwibGVuIiwibGVuZ3RoIiwidyIsImgiLCJyb290IiwieCIsInkiLCJmaW5kTm9kZSIsImZpdCIsInNwbGl0Tm9kZSIsImdyb3dOb2RlIiwidXNlZCIsInJpZ2h0IiwiZG93biIsImNhbkdyb3dEb3duIiwiY2FuR3Jvd1JpZ2h0Iiwic2hvdWxkR3Jvd1JpZ2h0Iiwic2hvdWxkR3Jvd0Rvd24iLCJncm93UmlnaHQiLCJncm93RG93biIsIlBhY2tlciIsImluaXQiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJEQSxTQUFTQSxhQUFULEdBQXlCOztBQUV6QkEsY0FBY0MsU0FBZCxHQUEwQjs7T0FFbkIs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
