const refreshWaitlistButton =
  document.getElementById("refreshWaitlist");

const logoutButton =
  document.getElementById("logoutButton");

const waitlistElement =
  document.getElementById("waitlist");

let refreshTimer = null;

refreshWaitlistButton.addEventListener(
  "click",
  loadWaitlist
);

logoutButton.addEventListener(
  "click",
  logout
);

async function checkAuthentication() {
  try {
    const response = await fetch("/api/auth/me");

    if (!response.ok) {
      window.location.href = "/staff-login.html";
      return false;
    }

    const data = await response.json();

    if (!data.authenticated) {
      window.location.href = "/staff-login.html";
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Could not check authentication:",
      error
    );

    window.location.href = "/staff-login.html";
    return false;
  }
}

async function loadWaitlist() {
  try {
    const response = await fetch("/api/waitlist");

    if (!response.ok) {
      throw new Error("Could not load waitlist");
    }

    const waitlist = await response.json();

    waitlistElement.innerHTML = "";

    if (waitlist.length === 0) {
      const emptyMessage = document.createElement("li");

      emptyMessage.className = "empty-message";
      emptyMessage.textContent =
        "No parties are currently waiting.";

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
      ticket.textContent =
        `Ticket ${party.ticket_number}`;

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
        const confirmed = window.confirm(
          `Are you sure you want to remove Ticket ${party.ticket_number}?`
        );

        if (!confirmed) {
          return;
        }

        await removeParty(party.ticket_number);
      });

      listItem.appendChild(partyInfo);
      listItem.appendChild(removeButton);

      waitlistElement.appendChild(listItem);
    }
  } catch (error) {
    console.error("Could not load waitlist:", error);

    waitlistElement.innerHTML = "";

    const errorMessage = document.createElement("li");

    errorMessage.className = "empty-message";
    errorMessage.textContent =
      "Unable to load the waitlist. Please try again.";

    waitlistElement.appendChild(errorMessage);
  }
}

async function removeParty(ticketNumber) {
  try {
    const response = await fetch(
      `/api/waitlist/${ticketNumber}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      let message = "Unable to remove the party.";

      try {
        const data = await response.json();
        message = data.error || message;
      } catch {
        // Keep the default error message.
      }

      alert(message);
      return;
    }

    await loadWaitlist();
  } catch (error) {
    console.error(
      "Could not remove party:",
      error
    );

    alert(
      "Unable to remove the party. Please try again."
    );
  }
}

async function logout() {
  try {
    const response = await fetch(
      "/api/auth/logout",
      {
        method: "POST"
      }
    );

    if (!response.ok) {
      alert("Could not log out. Please try again.");
      return;
    }

    stopAutomaticRefresh();

    window.location.href = "/staff-login.html";
  } catch (error) {
    console.error("Logout error:", error);

    alert(
      "Could not log out. Please try again."
    );
  }
}

function startAutomaticRefresh() {
  stopAutomaticRefresh();

  refreshTimer = setInterval(
    loadWaitlist,
    5000
  );
}

function stopAutomaticRefresh() {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

async function initializeStaffPage() {
  const authenticated =
    await checkAuthentication();

  if (!authenticated) {
    return;
  }

  await loadWaitlist();
  startAutomaticRefresh();
}

initializeStaffPage();