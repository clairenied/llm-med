# Resend Domain Setup for llm-med.art

## Namecheap DNS Setup - IMPORTANT TIPS

**USE SAFARI OR FIREFOX - NOT CHROME!** Namecheap has known issues with Chrome when editing DNS records. Records may not save properly.

### Common Pitfalls We Encountered:

1. **Wrong host names**: Namecheap may append `.mail` to hosts (e.g., `send.mail` instead of `send`). Make sure hosts are exactly:
   - `resend._domainkey` (not `resend._domainkey.mail`)
   - `send` (not `send.mail`)

2. **MX records location**: MX records are managed in the **MAIL SETTINGS** section at the bottom of Advanced DNS, not in the regular HOST RECORDS section.

3. **Custom MX dropdown**: Make sure "Custom MX" is selected in the Mail Settings dropdown before adding MX records.

4. **Delete and recreate**: If a record won't save with the correct host, delete it and create a new one rather than trying to edit.

### Where to add records in Namecheap:
- **TXT records** (DKIM, SPF): Add in HOST RECORDS section
- **MX records**: Add in MAIL SETTINGS section (select "Custom MX" first)

---

# Resend DNS Records Reference

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
