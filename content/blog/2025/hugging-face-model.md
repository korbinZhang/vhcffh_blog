---
date: 2025-05-15
tags: ["Hugging Face", "Model", "PyTorch", "TensorFlow"]
---

# Hugging Face 模型简介

下面是 Hugging Face 上各种**模型格式对应的加载方式和推理方法**，本文按文件类型分类说明，并给出具体代码示例：

- PyTorch
- Safetensors
- TensorFlow / Keras
- Flax / JAX
- ONNX
- TensorFlow\.js
- GGUF（llama.cpp）
- 分词器（Tokenizer）

## ✅ 1. PyTorch (`.bin`, `.pt`, `.pth`)

### 使用 Hugging Face Transformers：

```python
from transformers import AutoModel, AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("model_dir/")
model = AutoModel.from_pretrained("model_dir/")
inputs = tokenizer("Hello world", return_tensors="pt")
outputs = model(**inputs)
```

> `model_dir/` 目录中需要包含：`pytorch_model.bin` + `config.json` + tokenizer 文件

## ✅ 2. Safetensors (`.safetensors`)

等价于 PyTorch 权重，但更安全。Transformers 会自动识别，无需特殊处理。

```python
from transformers import AutoModel

model = AutoModel.from_pretrained("model_dir/")
```

### 纯 PyTorch 加载：

```python
from safetensors.torch import load_file

state_dict = load_file("model.safetensors")
model = MyModel()
model.load_state_dict(state_dict)
```

## ✅ 3. TensorFlow / Keras (`.h5`, `.pb`, `.ckpt`)

### Keras `.h5`：

```python
from tensorflow.keras.models import load_model

model = load_model("model.h5")
result = model.predict(input_data)
```

### SavedModel (`saved_model.pb`)

```python
import tensorflow as tf

model = tf.saved_model.load("saved_model_directory/")
result = model(input_tensor)
```

## ✅ 4. Flax / JAX (`.msgpack`)

需要使用 `transformers` 的 Flax 模型接口：

```python
from transformers import FlaxAutoModel

model = FlaxAutoModel.from_pretrained("model_dir/")
```

## ✅ 5. ONNX (`.onnx`)

使用 `onnxruntime` 推理：

```python
import onnxruntime
import numpy as np

session = onnxruntime.InferenceSession("model.onnx")
inputs = {"input_ids": np.array([[101, 102]])}
outputs = session.run(None, inputs)
```

## ✅ 6. TensorFlow\.js (`model.json` + `.bin`)

在 **浏览器中运行**：

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script>
  async function loadModel() {
    const model = await tf.loadGraphModel('path/to/model.json');
    const input = tf.tensor(...);  // 根据模型输入 shape 构造
    const output = model.predict(input);
  }
</script>
```

## ✅ 7. GGUF (`.gguf`)

用于 **llama.cpp** 项目中的大语言模型：

### CLI 推理：

```bash
./main -m model.gguf -p "Hello, how are you?"
```

或使用 [llama-cpp-python](https://github.com/abetlen/llama-cpp-python)：

```python
from llama_cpp import Llama

llm = Llama(model_path="model.gguf")
output = llm("Hello world", max_tokens=50)
```

## ✅ 8. 分词器（Tokenizer）

Hugging Face 的 `transformers` 和 `tokenizers` 均可自动加载：

```python
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("model_dir/")
inputs = tokenizer("文本", return_tensors="pt")
```

支持：

- `tokenizer.json`
- `vocab.txt`
- `merges.txt`
- `sentencepiece.model` 等

## 🧠 小结

| 文件类型       | 加载方法                                      |
| -------------- | --------------------------------------------- |
| `.bin`         | `transformers.AutoModel.from_pretrained()`    |
| `.safetensors` | 同上（自动识别），或用 `safetensors` 手动加载 |
| `.h5`          | `tf.keras.models.load_model()`                |
| `.pb`          | `tf.saved_model.load()`                       |
| `.onnx`        | `onnxruntime.InferenceSession()`              |
| `model.json`   | 浏览器中用 `tf.loadGraphModel()`              |
| `.gguf`        | llama.cpp 或 llama-cpp-python                 |
| 分词器相关文件 | `AutoTokenizer.from_pretrained()`             |
