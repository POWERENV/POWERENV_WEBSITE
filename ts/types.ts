//#region PNODES

export interface PNodeETHAccessPolicy {
    access_policy_id : Number
    access_policy_index_id : Number
    access_policy_ip_address : string
    access_policy_pnode_id : Number
    access_policy_type : string
}

export interface PNodeErrorLog {
    actionFlags : Array<string>
    actionStatus : string
    driverName : string
    errorLogID : string
    eventSeverity : string
    logDate : string
    logTime : string
    normalHardwareFRU : null
    pNodeNickname : string
    pPoolName : string | null
    rawData : string
    referenceCode : string
    subsystem : string
}

export interface PNodeFSPInfo {
    fspid : Number
    fspasmiLocalTime : string
    fspasmiPasswordHash : string
    fspasmiUsername : string
    fspasmiVersion : string
}

export interface PNodeLoginAudit {
    login_audit_id : Number;
    login_audit_datetime : string;
    login_audit_fsp_user : string;
    login_audit_location : string;
    login_audit_login_status : string;
    login_audit_pnode_nickname : string;
    login_audit_pnode_ppool_name : string | null;
}

export interface PNodeMachineInfo {
    pnode_machine_serial_number : string
    pnode_machine_type_model : string
    pnode_system_model_name : string
    pnode_system_pseries : string
}

export interface PNodeNICInfo {
    pnode_nic_id : Number
    pnode_id : Number
    pnode_nic_default_gateway : string
    pnode_nic_domain_name : string
    pnode_nic_first_dns_ip_address : string | null
    pnode_nic_second_dns_ip_address : string | null
    pnode_nic_third_dns_ip_address : string | null
    pnode_nic_hostname : string
    pnode_nic_ip_address : string
    pnode_nic_ip_address_type : string
    pnode_nic_mac_address : string
    pnode_nic_name : string
    pnode_nic_subnet_mask : string
    pnode_nic_type : string
}

export interface PNodeSingleOperationLog {
    operationAction : string
    operationBatchOperationID : Number
    operationBatchOperationName : string | Number
    operationCatName : string
    operationCompletionStatus : string
    operationDateTime : string
    operationDescription : string | null
    operationID : Number
    operationSeverityLevelID : Number | null
    operationSourcePNodeID : Number | null
    operationSourcePNodeName : string
    operationSourceUserName : string
}

export interface PNodeFullInfo {
    pnodeActivenessState : Boolean
    pnodeSerialCOMPortId : string
    pnode_attention_led_state : string
    pnode_config_datetime : string
    pnode_id : Number
    pnode_last_heartbeat_datetime : string
    pnode_last_update_datetime : string
    pnode_nickname : string
    pnode_nics_info : null
    pnode_parent_ppool_name : string
    pnode_readme_text : string
}

export interface PNodeBasicInfo {
    pnodeID : Number
    pnodeName : string
    pnodeLparsCount : Number
}

export interface PNodeDashboardData {
    pnodeETHAccessPolicies : Array<PNodeETHAccessPolicy>;
    pnodeErrorLogs : Array<PNodeErrorLog>;
    pnodeFSPInfo : PNodeFSPInfo;
    pnodeLoginAudits : Array<PNodeLoginAudit>;
    pnodeMachineInfo : PNodeMachineInfo;
    pnodeNICInfo : Array<PNodeNICInfo>;
    pnodeSingleOperationHistory : Array<PNodeSingleOperationLog>;
    pnode_full_info : PNodeFullInfo;
    statusMessage : string
}

export interface NewPNodeBasicInfo {
    pNodeID : Number;
    nickName : string;
    systemModelName : string;
    systemMachineTypeModel : string;
    systemMachineSerialNumber : string;
    systemPSeries : string;
    parentPPoolID : Number;
    readmeText : string;
    serialCOMPort : string;
}

export interface NewPNodeOSUserInfo {
    osid : Number;
    osUsername : string;
    osPasswordHash : string;
    osipAddress : string;
    osFamily : string;
}

export interface NewPNodeData {
    pnodeBasicInfo : NewPNodeBasicInfo;
    pnodeFSPInfo : PNodeFSPInfo;
    pnodeOSUserInfoType : NewPNodeOSUserInfo;
}

export interface MachineConnectionCredentialsData {
    COMPort : string
    username : string
    password : string
}

export interface PowerEnvInternalsMachineInfo {
    machineTypeModel : string
    serialNumber : string
    systemName : string
    asmiVersion : string
}

export interface PowerEnvInternalsNetworkInfo {
    macAddress : string
    ipaddress : string
    ipaddressType : string
    hostname : string
    domainName : string
    subnetMask : string
    defaultGateway : string
    ip1DNSSERVER : string
    ip2DNSSERVER : string
    ip3DNSSERVER : string
}

export interface MachineConnectionResponseData {
    systemInfo : PowerEnvInternalsMachineInfo,
    networkInfo : PowerEnvInternalsNetworkInfo
}

export interface ASMICommandResponse {
    commandResult : string
}

//#endregion PNODES

//#region PPOOLS

export interface PPoolBasicInfo {
    ppoolID : Number
    ppool_name : string
    ppoolPnodesCount : Number
    pnodesList : Array<PNodeBasicInfo>
}

export interface PPoolFullInfo {
    ppool_id : Number;
    ppool_name : string;
    ppool_tag : string;
    ppool_parent_pgrid_id : Number;
    ppool_parent_pgrid_name : string;
    ppool_creation_datetime : string;
    ppool_last_update_datetime : string;
    ppool_readme_text : string;
    ppool_pnodes_count : Number;
    ppool_active_pnodes_count : Number;
};

export interface PPoolAttentionLEDMarkedPNodes {
    pnode_nickname : string
    ppool_name : string
}

export interface PPoolsBatchOperationHistory {
    batchOperationID : Number
    batchOperationCatName : string
    batchOperationSourcePPoolID : Number
    batchOperationSourcePPoolName : string
    batchOperationAction : string
    batchOperationDateTime : string
    batchOperationSourceUserName : string
}

export interface PPoolsOperationHistory {
    pnodesSingleOperationHistory : Array<PNodeSingleOperationLog>
    ppoolsBatchOperationHistory : Array<PPoolsBatchOperationHistory>
}

export interface PPoolDashboardData {
    ppoolPNodesFullList : Array<PNodeBasicInfo>;
    ppoolFullInfo : PPoolFullInfo;
    ppoolLoginAudits : Array<PNodeLoginAudit>;
    ppoolAttentionLEDMarkedPNodes : Array<PPoolAttentionLEDMarkedPNodes>;
    ppoolErrorLogs : Array<PNodeErrorLog>;
    ppoolOperationLogs : PPoolsOperationHistory;
}

//#endregion PPOOLS

//#region PGRIDS

export interface AccessPolicyInfo {
    access_policy_id : Number;
    access_policy_name : string;
    access_policy_pgrid_name : string;
    access_policy_target_username : string;
    access_policy_creation_datetime : string;
    access_policy_last_update_datetime : string;
    access_policy_permission_level : string;
}

export interface AccessAuditInfo {
    access_audit_id : Number;
    access_audit_datetime : string;
    access_audit_performed_by_username : string;
    access_audit_target_pgrid_name : string;
}

export interface PGridBasicInfo {
    pgrid_id : Number;
    pgrid_name : string;
    pgrid_ppools_count : Number;
    pgrid_pnodes_count : Number;
};

export interface PGridFullInfo {
    pgrid_id : string;
    pgrid_name : string;
    pgrid_creation_datetime : string;
    pgrid_last_update_datetime : string;
    pgrid_owner : string;
    pgrid_readme_text : string;
    pgrid_ppools_count : Number;
    pgrid_pnodes_count : Number;
    pgrid_active_pnodes_count : Number;
}

export interface PGridDashboardData {
    accessPolicies : Array<AccessPolicyInfo>
    accessAudits : Array<AccessAuditInfo>
    pnodesLoginAudits : Array<PNodeLoginAudit>
    pnodesErrorLogs : Array<PNodeErrorLog>
    attentionLEDMarkedPNodes : Array<PPoolAttentionLEDMarkedPNodes>
    ppoolsInfoList : Array<PPoolBasicInfo>
    pgridFullInfo : PGridFullInfo
}

//#endregion PGRIDS

//#region HARDWARE

export interface GlobalEvent {
    globalEventId : Number
    globalEventSeverityLevel : string
    globalEventTitle : string
    globalEventDescription : string
    globalEventTriggeredAt : string
    notificationTargetUsername : string
    notificationAcknowledgementTimestamp : string
    notificationResolvedTimestamp : string
}

export interface GlobalEventTypesDistribution {
    informationalEventsCount : Number
    warningEventsCount : Number
    highImpactEventsCount : Number
    criticalEventsCount : Number
}

export interface GlobalEventCadenceRegistry {
    hourlyIntervalTimestamp : string
    eventCadence : Number
}

export interface NotificationInfo {
    notificationId : Number
    severityLevel : string
    title : string
    description : string
    triggeredAt : string
    notificationTargetUsername : string
    notificationAcknowledgementDatetime : string
    notificationResolvedDatetime : string
}

export interface eventsAndLoggingDashboard {
    notificationsListInfo : Array<GlobalEvent>,
    globalEventsDistribution : GlobalEventTypesDistribution,
    globalEventsCadenceStats : Array<GlobalEventCadenceRegistry>,
    userNotifications : Array<NotificationInfo>,
    userScheduledBatchOperations : Array<PPoolsBatchOperationHistory>
}

//#endregion HARDWARE

//#region USERS

export interface WhoamiInfo {
    userId : Number,
    username : string,
    email : string,
    profilePicture : string
}

export interface WhoamiReturnPacket {
    operationStatus : Boolean;
    statusMessage : string;
    packetData : WhoamiInfo;
}

//#endregion USERS

//#region GENERIC_UTILITIES

export class navigationTreeNode {
    objName : string;
    tag : string;
    state : string;
    children: Array<navigationTreeNode>;

    constructor(_objName : string, _tag : string, _state : string, _children: Array<navigationTreeNode>) {
        this.objName = _objName;
        this.tag = _tag;
        this.state = _state;
        this.children = _children;
    }
}

export class FunctionObject {
    function : Function;
    args : Array<any>;

    constructor(_function : Function, _args : Array<any>){
        this.function = _function;
        this.args = _args;
    }
}

//#endregion GENERIC_UTILITIES