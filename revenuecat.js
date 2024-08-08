/***********************************

> ScriptName        𝐋𝐨𝐜𝐤𝐞𝐭 𝐆𝐨𝐥𝐝

[rewrite_local]

# ～ RevenueCat
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/[^/]+$) url script-response-body https://raw.githubusercontent.com/DungHoang120401/Nobita/CSA_Module/revenuecat.js
^https:\/\/api\.revenuecat\.com\/.+\/(receipts|subscribers) url script-request-header https://raw.githubusercontent.com/DungHoang120401/Nobita/CSA_Module/deleteHeader.js

[mitm]

hostname=api.revenuecat.com

***********************************/
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket' : ['Gold']
};

var ua=$request.headers["User-Agent"]||$request.headers["user-agent"],obj=JSON.parse($response.body);obj.Attention="𝐁𝐲: 𝐍𝐨𝐛𝐢𝐭𝐚 (𝐌𝐎𝐃 𝐂𝐒𝐀𝟒𝐆)";var nobita_01={is_sandbox:!1,ownership_type:"PURCHASED",billing_issues_detected_at:null,period_type:"normal",expires_date:"2099-12-18T01:04:17Z",grace_period_expires_date:null,unsubscribe_detected_at:null,original_purchase_date:"2024-08-08T01:04:18Z",purchase_date:"2024-08-08T01:04:17Z",store:"app_store"},nobita_02={grace_period_expires_date:null,purchase_date:"2024-08-08T01:04:17Z",product_identifier:"com.nobita_01.premium.yearly",expires_date:"2099-12-18T01:04:17Z"};const match=Object.keys(mapping).find(e=>ua.includes(e));if(match){let[e,s]=mapping[match];s?(nobita_02.product_identifier=s,obj.subscriber.subscriptions[s]=nobita_01):obj.subscriber.subscriptions["com.nobita_01.premium.yearly"]=nobita_01,obj.subscriber.entitlements[e]=nobita_02}else obj.subscriber.subscriptions["com.nobita_01.premium.yearly"]=nobita_01,obj.subscriber.entitlements.pro=nobita_02;$done({body:JSON.stringify(obj)});
