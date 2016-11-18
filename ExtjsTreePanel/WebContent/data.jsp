<%

String data = "{'childList':[{'value':'1','root':'','statusCd':'','level':1,'primaryKeyData':'','treeId':'1','favourites':'N','childList':[{'value':'2','root':'','statusCd':'','level':2,'primaryKeyData':'','treeId':'2','favourites':'N','childList':[{'value':'20448','root':'','statusCd':'','level':3,'primaryKeyData':'','treeId':'20448','favourites':'N','childList':[{'value':'3','root':'','statusCd':'','level':4,'primaryKeyData':'','treeId':'3','favourites':'N','childList':[{'value':'22901','root':'','statusCd':'','level':5,'primaryKeyData':'','treeId':'22901','favourites':'N','childList':[{'value':'12214','root':'','statusCd':'','level':6,'primaryKeyData':'','treeId':'12214','favourites':'N','childList':[{'value':'12667','root':'','statusCd':'','level':7,'primaryKeyData':'','treeId':'12667','favourites':'N','childList':[{'value':'12702','root':'','statusCd':'','level':8,'primaryKeyData':'','treeId':'12702','favourites':'N','childList':[{'value':'9917662','root':'','statusCd':'','level':9,'primaryKeyData':'','treeId':'9917662','favourites':'N','childList':[{'value':'16350','root':'','statusCd':'','level':10,'primaryKeyData':'','treeId':'16350','favourites':'N','childList':[],'description':'ICG KYC_AML (Other ICG) [L10]','selectedNode':'','routineType':''},{'value':'4283','root':'','statusCd':'','level':10,'primaryKeyData':'','treeId':'4283','favourites':'N','childList':[],'description':'ICG KYC_AML (CTS) [L10]','selectedNode':'','routineType':''},{'value':'9820887','root':'','statusCd':'','level':10,'primaryKeyData':'','treeId':'9820887','favourites':'N','childList':[],'description':'PU/CO - AML [L10]','selectedNode':'','routineType':''}],'description':'ICG KYC Control Unit (AML) [L9]','selectedNode':'','routineType':''}]}]}]}]}]}]}]}]}]}";

String d = "[{'id':'1','text':'1','expanded':true,'children':[{'id':'5','text':'5','leaf':true},{'id':'6','text':'6','leaf':true}]},{'id':'2','text':'2','leaf':true},{'id':'3','text':'3','leaf':true},{'id':'4','text':'4','leaf':true},{'id':'7','text':'7','leaf':true},{'id':'8','text':'8','leaf':true},{'id':'9','text':'9','leaf':true},{'id':'10','text':'10','expanded':true,'children':[{'id':'11','text':'11'},{'id':'12','text':'12','leaf':true}]}]";

long leaf;

//if("id".equalsIgnoreCase(node) || "root".equalsIgnoreCase(node)){
//	leaf = 1;		
//}else{
//	leaf = Integer.parseInt(node);
//}


Object obj = getServletContext().getAttribute("cacheVal");

if(obj == null){
	leaf = 1;
}else{
	leaf = Long.parseLong(obj.toString());
}

System.out.println(leaf);


d = "[{'id':'"+leaf+10+"','text':'Child of "+(leaf+10)+"','children':[{'id':'"+leaf+20+"','text':' Child of "+(leaf+20)+"'}]},{'id':'"+(leaf+30)+"','text':'Child of "+(leaf+30)+"','children':[{'id':'"+(leaf+40)+"','text':'"+(leaf+40)+"','leaf':true},{'id':'"+(leaf+50)+"','text':'"+(leaf+50)+"','leaf':true}]}]";

getServletContext().setAttribute("cacheVal",leaf+1);

out.print(d);
%>