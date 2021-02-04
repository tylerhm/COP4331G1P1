// Local store for all contacts
let contacts = new Map;
let selectedContact = undefined;
let selectedLink = undefined;

// Assign event handlers.
$(document).on("click", ".contact-link", onClickContact);
$(document).on("click", "#delete-btn", onClickDelete);
$(document).on("click", "#create-btn", onClickCreate);

function onClickContact(e) {
	e.preventDefault();

	// Capture contact ID from DOM
	const contactID = $(this).data("contact-id");

	// Fetch contact from local cache.
	const contact = contacts.get(contactID);

	// Deselect old link
	if (selectedLink !== undefined) {
		deselect(selectedLink);
	}

	// Update selected index.
	selectedContact = contact;

	// Update selected link;
	selectedLink = this;
	select(selectedLink);

	displayContact(contact);
}

function onClickDelete(e) {
	e.preventDefault();

	console.log(selectedContact);

	// Update remote DB
	deleteContact(selectedContact);

	// Remove from DOM
	removeContactLink(selectedContact.ID);
}

function onClickCreate(e) {
	e.preventDefault();

	// Fetch DOM and serialize
	const form = document.getElementById("editForm");
	const data = new FormData(form);

	// Get Form Data
	const contact = {};
	data.forEach(function (value, key) {
		contact[key] = value;
	});

	console.log(contact);

	// Update DB and assign ID's
	contact.UserID = id;
	contact.ID = createContact(contact);

	// Update DOM
	appendContactLink(contact);
}

function select(contactLink) {
	contactLink.querySelector(".list-group-item").classList.add("active");
}

function deselect(contactLink) {
	contactLink.querySelector(".list-group-item").classList.remove("active");
}

function displayContact(contact) {

	const infoDiv = document.getElementById("info-pane");

	// Update auxiliary views.
	const contactProfile = document.getElementById("info-initials");
	const fullNameHeader = document.getElementById("info-full-name");

	contactProfile.innerHTML = contact.FirstName[0] + contact.LastName[0];
	fullNameHeader.innerHTML = contact.FirstName + " " + contact.LastName;

	console.log(contact);

	// Iterate over and update standard contact fields.
	for (let i = 0; i < infoDiv.children.length; i++) {
		const child = infoDiv.children[i];

		// Skip over not standard views.
		if (!("contactKey" in child.dataset)) {
			continue;
		}

		const key = child.dataset.contactKey;

		if (contact[key] === "") {
			console.log("OK");
			child.style.display = "none";
		} else {
			child.style.removeProperty("display");
		}

		const body = child.querySelector("p");

		// Lookup the data attribute on the div an assign the associated value.
		body.innerHTML = contact[child.dataset.contactKey];
	}
}

/**
 * Requests all of a user's contacts, and pushes them onto the contacts list
 *
 * @param displayFirst whether or not we should automatically display the first user
 */
function populateContacts(displayFirst)
{
	// Clear all children of the contact holder
	let contactLanding = document.getElementById("contactLanding");
	while (contactLanding.firstChild)
		contactLanding.removeChild(contactLanding.firstChild);

	const fetchedContacts = getContacts();

	// Hash values into map
	fetchedContacts.forEach(function (contact) {
		contacts.set(contact.ID, contact);
		appendContactLink(contact);
	});

	// Display first contact if requested.
	if (displayFirst && contacts.size > 0) {
		displayContact(contacts.entries().next().value[1]);
	}

}

/**
 * Removes contact like from DOM.
 *
 * @param id ID of the contact.
 */
function removeContactLink(id) {
	$(".list-group").children().each(function (index, link) {
		if ($(link).data("contact-id") === id) {
			$(link).remove();
		}
	});

	// Delete from local cache.
	contacts.delete(id);
}

/**
 * Appends a contact to the contact list
 *
 * @param contact The contact to be appended
 */
function appendContactLink(contact) {

	// Add contact to local array store
	contacts.set(contact.ID, contact);

	let contactFirst = contact.FirstName;
	let contactLast = contact.LastName;
	let contactInitials = contactFirst[0] + contactLast[0];
	let contactFullName = contactFirst + " " + contactLast;

	let contactLanding = document.getElementById("contactLanding");
	let contactLink = document.createElement("a");

	// Set HTML
	contactLink.innerHTML = `
	<div class="list-group-item d-flex contact-card" style="min-height: 50px;">
		<div class="profile-icon d-flex justify-content-center align-self-center">
			<div class="align-self-center" style="width: 100%;">
				<h3 class="profile-ab">${contactInitials}</h3>
			</div>
		</div>
		<div class="d-flex align-items-center justify-content-center w-100" style="padding: 5px;">
			<h5 style="text-align: center; margin: 0; width: 100%; cursor: pointer">${contactFullName}</h5>
    	</div>
    </div>`

	// Add associated data
	contactLink.dataset.contactId = contact.ID;
	contactLink.style.color = "inherit";
	contactLink.className = "contact-link";

	contactLanding.appendChild(contactLink);
}

// Temporary service alert
function editSelectedContact()
{
	alert("We don't support this feature yet, check back later!");
}