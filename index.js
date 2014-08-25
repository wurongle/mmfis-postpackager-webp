'use strict';

module.exports = function(ret, settings, conf, opt) { //打包后处理
    var execFile = require('child_process').execFile;
    var binPath = require('webp-bin').path;
    var quality = conf.quality || 80;

    function process(id, res) {
        if (/\.(png|jpg|jpeg)/.test(res.ext)) {
            imagesHandler(id, res);
        }
    }

    function imagesHandler (id, res) {
        var _tmpFile = fis.file(res.realpath);
        if(!_tmpFile.exists()){
            fis.util.write(res.realpath, res._content);
            _tmpFile._pkgImg = true;
        }
        var image_file = fis.file.wrap(res.realpathNoExt + '.webp');
        execFile(binPath, (res.realpath + ' -q '+ quality +' -o ' + image_file.realpath).split(/\s+/), function(err, stdout, stderr) {
            image_file.setContent(fis.util.read(image_file.realpath));
            _tmpFile._pkgImg && fis.util.del(_tmpFile.realpath);
        });
        ret.pkg[res.subpathNoExt + '.webp'] = image_file;
    }

    var _pkg = fis.util.clone(ret.pkg);
    fis.util.map(ret.pkg, process);
    fis.util.map(ret.src, process);
};