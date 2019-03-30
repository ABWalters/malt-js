# Transforms
## To Hash
Return the cert hashes for a given CrtSH ID
| Param     | Value                               |
| --------- | ----------------------------------- |
| Name | CrtShID-To-Hash |
| InputType | maltjs.CrtShID |
| OutputType | maltego.Hash |
## To CrtShID
Query crt.sh and return the CrtSH IDs matching the search phrase.
| Param     | Value                               |
| --------- | ----------------------------------- |
| Name | Phrase-To-CrtShID |
| InputType | maltego.Phrase |
| OutputType | maltjs.CrtShID |
## To CrtShID
Query crt.sh and return the CrtSH IDs matching the search hash.
| Param     | Value                               |
| --------- | ----------------------------------- |
| Name | Hash-To-CrtShID |
| InputType | maltego.Hash |
| OutputType | maltjs.CrtShID |
## To Issuer
Return the cert issuer for a given CrtSH ID
| Param     | Value                               |
| --------- | ----------------------------------- |
| Name | CrtShID-To-Phrase-Issuer |
| InputType | maltjs.CrtShID |
| OutputType | maltego.Phrase |
## To Subject Name
Return the cert subject name for a given CrtSH ID
| Param     | Value                               |
| --------- | ----------------------------------- |
| Name | CrtShID-To-DNS-SN |
| InputType | maltjs.CrtShID |
| OutputType | maltego.DNS |
## To Subject Alternative Names
Return the cert subject alternative names for a given CrtSH ID
| Param     | Value                               |
| --------- | ----------------------------------- |
| Name | CrtShID-To-DNS-SAN |
| InputType | maltjs.CrtShID |
| OutputType | maltego.DNS |
## To Serial
Return the cert serial for a given CrtSH ID
| Param     | Value                               |
| --------- | ----------------------------------- |
| Name | CrtShID-To-Phrase-Serial |
| InputType | maltjs.CrtShID |
| OutputType | maltego.Phrase |
