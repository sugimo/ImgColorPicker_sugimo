var FRONTJS = {};

FRONTJS = {
  //input type="file"に入れた画像データをDataURLで表示させる
  readImageFile : function(){
    var readImageFileId = document.getElementById('readImageFile'),//$('#readImageFile')だとfiles[0]がエラーになる
        imageDisplayCanvasId = document.getElementById('imageDisplayCanvas'),
        imageFile,
        canvasContext,
        fileTypeCheck = '',
        fileRoaderObject;

    var fileChangeEvent = function(){
      readImageFileId.addEventListener('change',function(){
        imageFile = this.files[0];

        //アップロードされたファイルの拡張子が画像化どうか確認
        fileTypeCheckFunction(imageFile);

        //アップロードされたファイルが画像形式じゃなかったら処理を終える
        if(fileTypeCheck === ''){
          alert('File format is not in the image.');
          this.value = '';
          return false;
        }

        //アップロードされたファイルを読み込んでDataURLで表示させる
        fileRoaderObject = new FileReader();
        fileRoaderObject.onload = onFileLoad;

        fileRoaderObject.readAsDataURL(imageFile);

        //アップロードされたファイルの形式判定フラグをでデフォルトにする
        fileTypeCheck = '';

      },false);
    },
    fileTypeCheckFunction = function(imageFile){
      if(imageFile.type === 'image/png' || imageFile.type === 'image/jpeg' || imageFile.type === 'image/gif'){
        fileTypeCheck = 'fileIsImage';

        return fileTypeCheck;
      }
    },
    onFileLoad = function(e){
      var dataUrlValue = e.target.result,
          getImageSize;

      getImage = new Image();
      getImage.src = dataUrlValue;

       //canvasのサイズ属性をアップロードした画像と同じにする
      imageDisplayCanvasId.setAttribute('width',getImage.width);
      imageDisplayCanvasId.setAttribute('height',getImage.height);

      canvasContext = imageDisplayCanvasId.getContext('2d');

      //画像を読み込んだらcanvasに画像を表示する
      getImage.onload = function() {
        canvasContext.drawImage(getImage, 0, 0, getImage.width, getImage.height);
      };

      readImageFileId.style.display = 'none';
    }

    //execute
    fileChangeEvent();
  },
  colorPickFunction : function(){
    var canvasOffset = $('#imageDisplayCanvas').offset(),
        imageDisplayCanvasId = document.getElementById('imageDisplayCanvas'),
        canvasX = 0,
        canvasY = 0,
        imageData = {},
        pixel = [],
        rgba = '',
        hex = '',
        preview = $('#preview'),
        colorInfoR = $('#colorInfoR'),
        colorInfoG = $('#colorInfoG'),
        colorInfoB = $('#colorInfoB'),
        colorInfoHex = $('#colorInfoHex');

        canvasContext = imageDisplayCanvasId.getContext('2d');

    // マウスカーソル上にあるピクセルの色情報を取得
    $('#imageDisplayCanvas').on('mousemove', function(e) {
        canvasX = Math.floor(e.pageX - canvasOffset.left);
        canvasY = Math.floor(e.pageY - canvasOffset.top);

        imageData = canvasContext.getImageData(canvasX, canvasY, 1, 1);
        pixel = imageData.data;
        rgba = 'rgba(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ',' + pixel[3] + ')';
        hex = pixel[0].toString(16) + pixel[1].toString(16) + pixel[2].toString(16);

        // 取得した色情報を画面に渡す
        preview.css({backgroundColor: rgba});
        colorInfoR.html(pixel[0]);
        colorInfoG.html(pixel[1]);
        colorInfoB.html(pixel[2]);
        colorInfoHex.html(hex);
    });
  }
};

window.onload = function(){
  //input type="file"に入れた画像データをDataURLで表示させる
  FRONTJS.readImageFile();

  //canvasのオンマウスで色をピックアップする
  FRONTJS.colorPickFunction();

};