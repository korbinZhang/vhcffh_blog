---
date: 2019-12-21
---

# Transformers



[transformers](https://github.com/huggingface/transformers)（与*pytorch-transformers*和*pytorch-pretrained-bert*相似）是python的一个库，它提供了用于自然语言理解(NLU)和自然语言生成(NLG)的多种预训练模型（BERT，GPT-2，RoBERTa，XLM，DistilBert，XLNet.....），为100多种语言提供了超过32种的预训练模型，并实现Tensorflow
2.0和Pytorch的深度互操作。

特点

-   与pytorch-transformers一样容易使用
-   如Keras一样强大简洁
-   在NLU和NLG任务上有很好的表现
-   容易学习

模型

1.  [BERT](https://github.com/google-research/bert) (from Google)
    released with the paper [BERT: Pre-training of Deep Bidirectional
    Transformers for Language
    Understanding](https://arxiv.org/abs/1810.04805) by Jacob Devlin,
    Ming-Wei Chang, Kenton Lee and Kristina Toutanova.
2.  [GPT](https://github.com/openai/finetune-transformer-lm) (from
    OpenAI) released with the paper [Improving Language Understanding by
    Generative
    Pre-Training](https://blog.openai.com/language-unsupervised) by Alec
    Radford, Karthik Narasimhan, Tim Salimans and Ilya Sutskever.
3.  [GPT-2](https://blog.openai.com/better-language-models) (from
    OpenAI) released with the paper [Language Models are Unsupervised
    Multitask Learners](https://blog.openai.com/better-language-models)
    by Alec Radford*, Jeffrey Wu*, Rewon Child, David Luan, Dario Amodei
    **and Ilya Sutskever**.
4.  [Transformer-XL](https://github.com/kimiyoung/transformer-xl) (from
    Google/CMU) released with the paper [Transformer-XL: Attentive
    Language Models Beyond a Fixed-Length
    Context](https://arxiv.org/abs/1901.02860) by Zihang Dai*, Zhilin
    Yang*, Yiming Yang, Jaime Carbonell, Quoc V. Le, Ruslan
    Salakhutdinov.
5.  [XLNet](https://github.com/zihangdai/xlnet) (from Google/CMU)
    released with the paper [XLNet: Generalized Autoregressive
    Pretraining for Language
    Understanding](https://arxiv.org/abs/1906.08237) by Zhilin Yang*,
    Zihang Dai*, Yiming Yang, Jaime Carbonell, Ruslan Salakhutdinov,
    Quoc V. Le.
6.  [XLM](https://github.com/facebookresearch/XLM) (from Facebook)
    released together with the paper [Cross-lingual Language Model
    Pretraining](https://arxiv.org/abs/1901.07291) by Guillaume Lample
    and Alexis Conneau.
7.  [RoBERTa](https://github.com/pytorch/fairseq/tree/master/examples/roberta)
    (from Facebook), released together with the paper a [Robustly
    Optimized BERT Pretraining
    Approach](https://arxiv.org/abs/1907.11692) by Yinhan Liu, Myle Ott,
    Naman Goyal, Jingfei Du, Mandar Joshi, Danqi Chen, Omer Levy, Mike
    Lewis, Luke Zettlemoyer, Veselin Stoyanov.
8.  [DistilBERT](https://huggingface.co/transformers/model_doc/distilbert.html)
    (from HuggingFace) released together with the paper [DistilBERT, a
    distilled version of BERT: smaller, faster, cheaper and
    lighter](https://arxiv.org/abs/1910.01108) by Victor Sanh, Lysandre
    Debut and Thomas Wolf. The same method has been applied to compress
    GPT2 into
    [DistilGPT2](https://github.com/huggingface/transformers/tree/master/examples/distillation).
9.  [CTRL](https://github.com/pytorch/fairseq/tree/master/examples/ctrl)
    (from Salesforce), released together with the paper [CTRL: A
    Conditional Transformer Language Model for Controllable
    Generation](https://www.github.com/salesforce/ctrl) by Nitish
    Shirish Keskar*, Bryan McCann*, Lav R. Varshney, Caiming Xiong and
    Richard Socher.
10. [CamemBERT](https://huggingface.co/transformers/model_doc/camembert.html)
    (from FAIR, Inria, Sorbonne Université) released together with the
    paper [CamemBERT: a Tasty French Language
    Model](https://arxiv.org/abs/1911.03894) by Louis Martin, Benjamin
    Muller, Pedro Javier Ortiz Suarez, Yoann Dupont, Laurent Romary,
    Eric Villemonte de la Clergerie, Djame Seddah, and Benoît Sagot.
11. [ALBERT](https://github.com/google-research/ALBERT) (from Google
    Research), released together with the paper a [ALBERT: A Lite BERT
    for Self-supervised Learning of Language
    Representations](https://arxiv.org/abs/1909.11942) by Zhenzhong Lan,
    Mingda Chen, Sebastian Goodman, Kevin Gimpel, Piyush Sharma, Radu
    Soricut.
12. [XLM-RoBERTa](https://github.com/pytorch/fairseq/tree/master/examples/xlmr)
    (from Facebook AI), released together with the paper [Unsupervised
    Cross-lingual Representation Learning at
    Scale](https://arxiv.org/abs/1911.02116) by Alexis Conneau*,
    Kartikay Khandelwal*, Naman Goyal, Vishrav Chaudhary, Guillaume
    Wenzek, Francisco Guzmán, Edouard Grave, Myle Ott, Luke Zettlemoyer
    and Veselin Stoyanov.

使用

对于每个模型，这个库主要涉及3个类

-   model classes：提供模型的结构，如：`BertModel`
-   configuration classes：存储构建模型的所有参数，如`BertConfig`
-   tokenizer
    classes：提供模型的词汇表和用于对字符串解码/编码的方法，如`BertTokenizer`

所有的实例可以通过`from_pretrained()`加载预训练模型，通过`save_pretrained()`保存模型

BERT example

从字符串获得输入向量

    import torch
    from transformers import BertTokenizer, BertModel, BertForMaskedLM

    # OPTIONAL: if you want to have more information on what's happening under the hood, activate the logger as follows
    import logging
    logging.basicConfig(level=logging.INFO)

    # Load pre-trained model tokenizer (vocabulary)
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    # 中文bert模型'bert-base-chinese'
    # bert 特殊的符号
    # '[MASK]' 用于mask language model
    # '[CLS]' 开头，用于分类的标记
    # '[PAD]' 
    # '[SEP]' 结尾，句子分隔符
    # '[UNK]'

    # Tokenize input
    text = "[CLS] Who was Jim Henson ? [SEP] Jim Henson was a puppeteer [SEP]"
    tokenized_text = tokenizer.tokenize(text)

    # Mask a token that we will try to predict back with `BertForMaskedLM`
    masked_index = 8
    tokenized_text[masked_index] = '[MASK]'
    assert tokenized_text == ['[CLS]', 'who', 'was', 'jim', 'henson', '?', '[SEP]', 'jim', '[MASK]', 'was', 'a', 'puppet', '##eer', '[SEP]']

    # Convert token to vocabulary indices
    indexed_tokens = tokenizer.convert_tokens_to_ids(tokenized_text)
    # Define sentence A and B indices associated to 1st and 2nd sentences (see paper)
    segments_ids = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1]

    # Convert inputs to PyTorch tensors
    tokens_tensor = torch.tensor([indexed_tokens])
    segments_tensors = torch.tensor([segments_ids])

对输入进行编码

    # Load pre-trained model (weights)
    model = BertModel.from_pretrained('bert-base-uncased')

    # Set the model in evaluation mode to deactivate the DropOut modules
    # This is IMPORTANT to have reproducible results during evaluation!
    model.eval()

    # If you have a GPU, put everything on cuda
    tokens_tensor = tokens_tensor.to('cuda')
    segments_tensors = segments_tensors.to('cuda')
    model.to('cuda')

    # Predict hidden states features for each layer
    with torch.no_grad():
        # See the models docstrings for the detail of the inputs
        outputs = model(tokens_tensor, token_type_ids=segments_tensors)
        # Transformers models always output tuples.
        # See the models docstrings for the detail of all the outputs
        # In our case, the first element is the hidden state of the last layer of the Bert model
        encoded_layers = outputs[0]
    # We have encoded our input sequence in a FloatTensor of shape (batch size, sequence length, model hidden dimension)
    assert tuple(encoded_layers.shape) == (1, len(indexed_tokens), model.config.hidden_size)

使用`BertForMaskedLM`预测masked token

    # Load pre-trained model (weights)
    model = BertForMaskedLM.from_pretrained('bert-base-uncased')
    model.eval()

    # If you have a GPU, put everything on cuda
    tokens_tensor = tokens_tensor.to('cuda')
    segments_tensors = segments_tensors.to('cuda')
    model.to('cuda')

    # Predict all tokens
    with torch.no_grad():
        outputs = model(tokens_tensor, token_type_ids=segments_tensors)
        predictions = outputs[0]

    # confirm we were able to predict 'henson'
    predicted_index = torch.argmax(predictions[0, masked_index]).item()
    predicted_token = tokenizer.convert_ids_to_tokens([predicted_index])[0]
    assert predicted_token == 'henson'

参考

1.<https://huggingface.co/transformers/index.html>
