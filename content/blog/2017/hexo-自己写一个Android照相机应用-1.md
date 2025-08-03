---
date: 2017-08-09
tags: ["Android", "Camera"]
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
