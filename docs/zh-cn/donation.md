# 打赏/赞助部分

在文章页面底部显示微信支付和支付宝打赏二维码。

## 配置

```toml
[params.donation]
  enable = false
  comment = "支持作者"
  wechatPay = "/images/wechatpay.png"
  alipay = "/images/alipay.png"
```

## 用法

将 `enable` 设置为 true 并提供微信支付和支付宝二维码的图片 URL。
该部分将出现在每篇文章页面的底部。

## 相关链接

- [主题配置](../en/theme-configuration.md)