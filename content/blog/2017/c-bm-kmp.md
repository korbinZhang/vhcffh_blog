---
date: 2017-12-21
---

# 字符串匹配算法

## BM

从左到右依次比较\
s:主串\
r:模式串

```c
int BM(char *s,int slen,char *r,int rlen){
    int i=1,j=1;
    while(i<=slen-rlen+1){
        while(j<=rlen&&s[i]==r[j]){
            i++;j++;
        }
        if(j>rlen){
            return i-j+1;
        }else{
            j=1;i++;
        }
    }
    return 0;
}
```

## KMP 算法

通过一个 next 数字\
当每次发生不匹配的时候\
模式串不必回到开头

```c
int* getnext(char *r, int n) { //next数组求解
    int i, j;
    int *next = (int *)malloc((n + 1) * sizeof(int));
    next[0] = n; next[1] = 0;
    j = 0;
    i=1;
    while(i<n){
        if (j == 0 || r[i] == r[j]) {
            ++i; ++j;
            next[i] = j;
        } else {
            j = next[j];
        }
    }
    return next;
}
int KMP(char *s,int slen,char *r,int rlen){
    int *next=getnext(r,rlen);
    int i=1,j=1;
    while(i<=slen&&j<=rlen){
        while(j<=rlen&&s[i]==r[j]){
            i++;j++;
        }
        if(j>rlen){
            return i-j+1;
        }else{
            j=next[j];i++;
        }
    }
    return 0;
}
```

## 参考文章

1. [字符串匹配的 KMP 算法](http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html)
