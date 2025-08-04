---
date: 2017-08-09
tags: ["Android", "Camera"]
description: 本文是开发自定义Android相机应用系列教程的第一部分，主要介绍了调用系统相机所需的基础知识。内容包括如何使用`Intent`配合`MediaStore.ACTION_IMAGE_CAPTURE`来启动系统相机程序。文章讲解了两种获取拍摄结果的方式：一种是通过`startActivityForResult`直接从返回的`Intent`数据中获取缩略图（Bitmap），另一种是指定一个文件URI作为输出路径（`MediaStore.EXTRA_OUTPUT`），然后从该文件中读取高清原图。此外，还提到了获取存储权限和处理`onActivityResult`回调的必要步骤。
---

# 自己写一个Android照相机应用-1



Android相机的相关知识

# Android Camera相关知识

调用系统相机
```java
Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
//使用action启动系统相机

//startActivity(intent);    
//仅调用相机拍照，不返回数据

//startActivityForResult(intent,REQ_1);
//调用相机并通过onActivityResult函数data返回数据；

Uri photoUri = Uri.fromFile(new File(mFilePath));//图片保存路径
intent.putExtra(MediaStore.EXTRA_OUTPUT,photoUri);
startActivityForResult(intent,REQ_2);
//从文件中读取数据
```

路径获取

```java
mFilePath = Environment.getExternalStorageDirectory().getPath();
mFilePath = mFilePath + "/" + "tmp.png";
```

读取内存卡权限
```xml
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"></uses-permission>
```

onActivityResult函数
```java        
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if(resultCode == RESULT_OK){
        if (requestCode == REQ_1) {//从data获取照片
            Bundle bundle = data.getExtras();
            Bitmap bitmap = (Bitmap)bundle.get("data");
            mImageView.setImageBitmap(bitmap);
        } else if (requestCode == REQ_2) {//从文件获取照片
            FileInputStream fis = null;
            try {
                fis = new FileInputStream(mFilePath);
                Bitmap bitmap = BitmapFactory.decodeStream(fis);
                mImageView.setImageBitmap(bitmap);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } finally {
                try {
                    fis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

注册action，实现照相功能
```xml
    <intent-filter>
            <action android:name="android.media.action.IMAGE_CAPTURE"/>
            <category android:name="android.intent.category.DEFAULT"/>
    </intent-filter>
```
