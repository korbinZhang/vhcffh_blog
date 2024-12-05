---
sidebar: false
outline: false
date: 2024-07-06
---

# FreshRSS 重置密码

FreshRSS 的用户密码没有存储在数据库中

存储在配置文件 `<freshrss-root>/data/users/<user-name>/config.php` 中

```php
<?php
return array (
...
  'passwordHash' => '$2a$09$pXJyqN3SxOOGw7YB.0P1M.CCDtEYPhd1by5aVBQSJw5Yvr9mYXIDa',
...
```

`passwordHash`是通过`password_hash`函数生成的，不可逆

使用`python`模块`bcrypt`生成一个新的密码，替换旧的密码

```python
import bcrypt
bcrypt.hashpw(b'12345678',bcrypt.gensalt())
# b'$2b$12$g5tE6HYOqJyea.TbA9jibeem9TItCDItYjqehIefQEpqomr/X0VTq'
```

因为 salt 不同，每次生成的 hash 值也不一样

替换后，用密码 `12345678` 即可登录，登陆后不要忘了配置新的密码

