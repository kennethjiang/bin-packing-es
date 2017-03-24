Binary Tree Algorithm for 2D Bin Packing
========================================

This project is a javascript experiment to write a binary tree based
bin packing algorithm that is suitable for generating
[CSS sprites](https://github.com/jakesgordon/sprite-factory).

 * You can play with the [demo here](http://codeincomplete.com/posts/2011/5/7/bin_packing/example/)
 * You can find a [description here](http://codeincomplete.com/posts/2011/5/7/bin_packing/)

Install
=========

    npm i --save bin-packing-es

Usage
=====

If you want to use this in your own javascript projects, you need something like this:

      import { Packer } from 'bin-packing-es';
      var packer = new Packer(1000, 1000);   // or:  new GrowingPacker();
      var blocks = [
        { w: 100, h: 100 },
        { w: 100, h: 100 },
        { w:  80, h:  80 },
        { w:  80, h:  80 },
        etc
        etc
      ];

      blocks.sort(function(a,b) { return (b.h < a.h); }); // sort inputs for best results
      packer.fit(blocks);
  
      for(var n = 0 ; n < blocks.length ; n++) {
        var block = blocks[n];
        if (block.fit) {
          DrawRectangle(block.fit.x, block.fit.y, block.w, block.h);
        }
      }

See source code comments for more details.

Demo
====


    git clone https://github.com/kennethjiang/bin-packing-es.git
    cd bin-packing-es
    npm install && npm run build

View the examples/index.html file in your favorite browser for examples of algorithm in use with lots of configurable options.

License
=======

See [LICENSE](https://github.com/jakesgordon/bin-packing/blob/master/LICENSE) file.

Contact
=======

Submit your issues or contact the original author or bin-packing
[jake@codeincomplete.com](mailto:jake@codeincomplete.com), or via
website: [Code inComplete](http://codeincomplete.com/posts/2011/5/7/bin_packing/)

