const refreshWaitlistButton =
  document.getElementById("refreshWaitlist");

const waitlistElement =
  document.getElementById("waitlist");

refreshWaitlistButton.addEventListener(
  "click",
  loadWaitlist
);

async function loadWaitlist() {
  const response = await fetch("/api/waitlist");
  const waitlist = await response.json();

  waitlistElement.innerHTML = "";

  if (waitlist.length === 0) {
    const emptyMessage = document.createElement("li");

    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "No parties are currently waiting.";

    waitlistElement.appendChild(emptyMessage);

    return;
  }

  for (const party of waitlist) {
    const listItem = document.createElement("li");

    listItem.className = "waitlist-item";

    const partyInfo = document.createElement("div");

    partyInfo.className = "party-info";

    const ticket = document.createElement("div");

    ticket.className = "ticket";
    ticket.textContent = `Ticket ${party.ticket_number}`;

    const partyDetails = document.createElement("div");

    partyDetails.className = "party-details";
    partyDetails.textContent =
      `${party.name} (${party.party_size} people)`;

    partyInfo.appendChild(ticket);
    partyInfo.appendChild(partyDetails);

    const removeButton = document.createElement("button");

    removeButton.className = "remove-button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", async () => {
      await removeParty(party.ticket_number);
    });

    listItem.appendChild(partyInfo);
    listItem.appendChild(removeButton);

    waitlistElement.appendChild(listItem);
  }
}

async function removeParty(ticketNumber) {
  const response = await fetch(
    `/api/waitlist/${ticketNumber}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    const data = await response.json();
    alert(data.error);
    return;
  }

  await loadWaitlist();
}

loadWaitlist();