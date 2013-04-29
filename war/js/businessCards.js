// This file was automatically generated from businessCards.soy.
// Please don't edit this file by hand.

if (typeof rememberme == 'undefined') { var rememberme = {}; }
if (typeof rememberme.template == 'undefined') { rememberme.template = {}; }


rememberme.template.businessCard = function(opt_data, opt_ignored) {
  return '<div id="cardPanel"><div id="createForm"><div class="panelLabel"><label for="cardName">Name</label></div><div class="panelInput"><input type="text" value="' + soy.$$escapeHtml(opt_data.businessCard.name) + '" id="cardName" disabled="disabled" /></div><div class="panelLabel"><label for="created">Created</label></div><div class="panelInput"><input type="text" value="' + soy.$$escapeHtml(opt_data.businessCard.created) + '" id="created" disabled="disabled" /></div><div class="panelLabel"><label for="lastModified">Last Updated</label></div><div class="panelInput"><input type="text" value="' + soy.$$escapeHtml(opt_data.businessCard.lastModified) + '" id="lastModified" disabled="disabled" /></div><div class="panelLabel"><label>Card image</label></div><div class="panelInput">&nbsp;</div><div><img src="' + soy.$$escapeHtml(opt_data.businessCard.fullUrl) + '" width="320" height="240" /></div><div class="panelLabel"><label>Taken here:</label></div><div class="panelInput">&nbsp;</div><div id="mapdiv"></div><div id="submitButton" style="width: 100%; margin-top: 10px; text-align:center;"><input type="button" id="updateCardButton" value="Update" onclick="handleUpdate();" />&nbsp;<input type="button" id="deleteCardButton" value="Delete" onclick="handleDelete(1);" />&nbsp;<input type="button" onclick="handleList();" value="Cancel" /></div><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.latitude) + '" id="latitude" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.longitude) + '" id="longitude" /></div></div><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.id) + '" id="cardId" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.thumbnailUrl) + '" id="thumbnailUrl" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.fullUrl) + '" id="fullUrl" />';
};


rememberme.template.businessCardsNonWebGl = function(opt_data, opt_ignored) {
  return '\t<div id="businessCardsNonWebGlContainer"><div id="businessCardsNonWebGl"></div></div>';
};


rememberme.template.createCardPanel = function(opt_data, opt_ignored) {
  return '<div id="cardPanel"><div id="createForm"><div class="instruction">Step 1: Give it a name</div><div class="panelLabel"><label for="cardName">To whom does this card belong?</label></div><div class="panelInput"><input type="text" id="cardName" /></div></div><div class="instruction">Step 2: Give it a picture</div><div class="panelLabel"><label for="fileupload">Upload a picture or take a photo</label></div><div class="panelInput"><input type="button" id="proxybutton" value="Acquire" onclick="document.querySelector(\'#fileupload\').click();" /><input type="file" accept="image/png" capture="camera" id="fileupload" name="myFile" onchange="previewPicture();" style="display: none;" /></div><div class="instruction">Step 3: Preview business card</div><div style="width: 320px; height: 240px; border: 1px solid black; margin: 0 auto;"><canvas style="display:none;" id="canvas"></canvas><img src="" id="img" width="320" height="240" /></div><div class="instruction">Step 4: Save to your deck</div><div id="submitButton" style="width: 100%; margin-top: 10px; text-align:center;"><input type="button" onclick="handleCreate();" value="Save" />&nbsp;<input type="button" onclick="handleList();" value="Cancel" /></div></div></div>';
};


rememberme.template.cardDisplayPanel = function(opt_data, opt_ignored) {
  return '<div id="rolodex"></div>';
};


rememberme.template.deleteCardConfirmationPanel = function(opt_data, opt_ignored) {
  return '<div id="deleteCardConfirmationPanel">Are you sure you want to delete the card named <b>' + soy.$$escapeHtml(opt_data.businessCard.name) + '</b>?<input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.id) + '" id="cardId" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.thumbnailUrl) + '" id="thumbnailUrl" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.fullUrl) + '" id="fullUrl" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.longitude) + '" id="longitude" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.latitude) + '" id="latitude" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.name) + '" id="cardName" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.created) + '" id="created" /><input type="hidden" value="' + soy.$$escapeHtml(opt_data.businessCard.lastModified) + '" id="lastModified" /><input type="button" id="deleteConfirmButton" value="Yes" onclick="handleDelete(2);" /><input type="button" id="deleteRejectButton" value="No" onclick="handleDelete(3);" /></div>';
};
