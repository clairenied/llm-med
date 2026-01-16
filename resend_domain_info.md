# Resend information for DNS records in the domain provider

## Domain Verification

### DKIM

| Type | Host | Value | TTL | Priority |
| -------- | ------- | ------- | ------- | ------- |
| TXT | resend._domainkey | p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJF+1g2mx10SLqRhMc7YkHxhqFQtXd5EmldKJ6DzeLvZkjBdeK9oH0aqT+vpQdJyqT+ATWJXc98T4mcKy5NVj4/WadRhbkD2rl46eHYzU02oWh1y3EjxQpW/ouSpVc5DiYDJh/xG2dmVzm1V502YRnpTFdE7d6aGsDfmFI+Oy4CwIDAQAB | Auto | |	

## Enable Sending (Turn On)

### SPF

| Type | Host | Value | TTL | Priority |
| -------- | ------- | ------- | ------- | ------- |
| MX | send | feedback-smtp.us-east-1.amazonses.com | Auto | 10 |
| TXT | send | v=spf1 include:amazonses.com ~all | Auto | |	

### DMARC (Optional)

| Type | Name | Content | TTL |
| -------- | ------- | ------- | ------- |
| TXT | _dmarc | v=DMARC1; p=none; | Auto |
