export const generateGoogleFormScript = (webhookUrl: string) => {
  return `
function onFormSubmit(e) {
  var url = "${webhookUrl}";
  var responses = e.namedValues;
  
  var payload = {
    googleForm: {
      respondentEmail: e.respondentEmail || "",
      responses: responses
    }
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}
`;
};
