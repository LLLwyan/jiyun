function getTypeName(item) {
    var map = {
        'cloud': '普通云盘',
        'cloud_efficiency': '高效云盘',
        'cloud_ssd': 'SSD盘',
        'local_ssd_pro': 'I/O密集型本地盘',
        'local_hdd_pro': '吞吐密集型本地盘',
        'ephemeral': '本地磁盘',
        'ephemeral_ssd': '本地SSD盘',
        'cloud_essd': 'ESSD云盘'
    };
    var mapHuawei = {
        'SATA': '普通IO磁盘',
        'SAS': '高IO磁盘',
        'SSD': '超高IO磁盘',
        'CO-P1': '高IO (性能优化Ⅰ型)',
        'UH-L1': '超高IO (时延优化)'
    };
    if (configParam.cloudType.aliyun == item.hostType) {
        return map[item.diskType];
    } else if (configParam.cloudType.huawei == item.hostType) {
        return mapHuawei[item.diskType.toUpperCase()];
    } else {
        return item.diskTypeName;
    }
}
