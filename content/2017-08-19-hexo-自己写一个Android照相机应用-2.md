+++
title = "自己写一个Android照相机应用-2"
date = 2017-08-19

[taxonomies]
categories = ["编程"]
tags = ["Android", "相机"]
+++

Android自定义相机的实现\
首先是要创建camera的生命周期
```java
    getCamera();//获取Camera对象
    setStartPreview(Camera camera,SurfaceHolder holder);//预览相机内容
    releaseCamera();//释放相机资源

activity生命周期与camera绑定

    protected void onResume() {
        super.onResume();
        if (mCamera == null) {
            mCamera = getCamera();
            if (mHolder != null) {
                setStartPreview(mCamera,mHolder);
            }
        }
    }
    protected void onPause() {
        super.onPause();
        releaseCamera();
    }
```

camera与surfaceview绑定
```java
    //预览图像与camera绑定
    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        setStartPreview(mCamera,mHolder);
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        mCamera.stopPreview();
        setStartPreview(mCamera,mHolder);
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        releaseCamera();
    }
```

声明相机使用权限
```xml
    <uses-permission android:name="android.permission.CAMERA"</uses-permission>
```

实现照相，通过回调将照片数据保存到文件，并将文件路径传递到其它activity(ResultAty)
```java
    private Camera.PictureCallback mPictureCallback = new Camera.PictureCallback() {
        @Override
        public void onPictureTaken(byte[] data, Camera camera) {//data中存储照片的全部信息
            File tempFile = new File("/sdacrd/temp.png");
            try {
                FileOutputStream fos = new FileOutputStream(tempFile);
                fos.write(data);
                fos.close();
                Intent intent = new Intent(CustomCamera.this,ResultAty.class);
                intent.putExtra("picPath",tempFile.getAbsolutePath());
                startActivity(intent);
                CustomCamera.this.finish();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    };
    public void capture(View view){
        Camera.Parameters parameters = mCamera.getParameters();
        parameters.setPictureFormat(ImageFormat.JPEG);//设置拍照格式jpg格式
        parameters.setPictureSize(800,400);//设置照片大小
        parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);//设置自动对焦
        mCamera.autoFocus(new Camera.AutoFocusCallback() {  //回调，对焦最清晰时拍照
        @Override
        public void onAutoFocus(boolean success, Camera camera) {
            if (success) {
                mCamera.takePicture(null,null,mPictureCallback);
            }
        }
        });

    }
```
