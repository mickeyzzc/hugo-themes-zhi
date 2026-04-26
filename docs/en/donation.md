# Donation/Sponsor Section

Display donation QR codes for WeChat Pay and Alipay at the bottom of post pages.

## Configuration

```toml
[params.donation]
  enable = false
  comment = "Support the author"
  wechatPay = "/images/wechatpay.png"
  alipay = "/images/alipay.png"
```

## Usage

Set `enable` to true and provide the image URLs for WeChat Pay and Alipay QR codes.
The section will appear at the bottom of each post page.

## Related

- [Theme Configuration](../en/theme-configuration.md)