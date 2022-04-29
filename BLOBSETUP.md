# Azure Blob Storage Setup
Run the following commands on the cloud shell, or do over the GUI
- **Fields in <> are arbitrary**
1. Create a Resource Group
```sh
New-AzResourceGroup -Name <name> -Location <region>
```
2. Create a Storage Account
```sh
New-AzStorageAccount -ResourceGroupName <resourceGroupName> -Name <storageAccountName> -SkuName Standard_LRS -Location <region> -Kind StorageV2 -AccessTier Hot
```
3. Get Storage Account Key
```sh
# Powershell Version >=1.4
$blobStorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName <resourceGroupName> -AccountName <storageAccountName>)| Where-Object {$_.KeyName -eq "key1"}
# Powershell Version <=1.3.2
$blobStorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName <resourceGroupName> -AccountName <storageAccountName>).Key1
```
4. Create a storage context:
```sh
$blobStorageContext = New-AzStorageContext -StorageAccountName <storageAccountName> -StorageAccountKey $blobStorageAccountKey
```
5. Use storage context to create new storage container:
```sh
New-AzStorageContainer -Name <containerName> -Context $blobStorageContext
```

## Required Env Keys
Obtained in the setup process
- AZURE_STORAGE_ACCOUNT_NAME
- AZURE_STORAGE_ACCOUNT_ACCESS_KEY
- AZURE_CONTAINER_NAME