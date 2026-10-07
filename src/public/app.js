const joinForm = document.getElementById("joinForm");
const joinResult = document.getElementById("joinResult");

const ticketNumberInput =
  document.getElementById("ticketNumber");

const checkPositionButton =
  document.getElementById("checkPosition");

const positionResult =
  document.getElementById("positionResult");

let positionTimer = null;

const savedTicket =
  localStorage.getItem("waitlistTicket");

if (savedTicket) {
  ticketNumberInput.value = savedTicket;

  awaitCheckPosition();

  startAutomaticUpdates();
}

joinForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name =
    document.getElementById("name").value;

  const partySize =
    Number(document.getElementById("partySize").value);

  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      partySize
    })
  });

  const data = await response.json();

  if (!response.ok) {
    joinResult.textContent = data.error;
    return;
  }

  joinResult.textContent =
    `Your ticket number is ${data.ticketNumber}.`;

  localStorage.setItem(
    "waitlistTicket",
    String(data.ticketNumber)
  );

  ticketNumberInput.value = data.ticketNumber;

  joinForm.reset();

  awaitCheckPosition();

  startAutomaticUpdates();
});

checkPositionButton.addEventListener(
  "click",
  async () => {
    awaitCheckPosition();
    startAutomaticUpdates();
  }
);

async function checkPosition() {
  const ticketNumber =
    Number(ticketNumberInput.value);

  if (
    !Number.isInteger(ticketNumber) ||
    ticketNumber <= 0
  ) {
    positionResult.textContent =
      "Enter a valid ticket number.";

    return;
  }

  localStorage.setItem(
    "waitlistTicket",
    String(ticketNumber)
  );

  const response = await fetch(
    `/api/waitlist/${ticketNumber}/ahead`
  );

  const data = await response.json();

  if (!response.ok) {
    positionResult.textContent = data.error;

    if (response.status === 404) {
      localStorage.removeItem("waitlistTicket");
      stopAutomaticUpdates();
    }

    return;
  }

  positionResult.textContent =
    `There are ${data.partiesAhead} parties ahead of you.`;
}

async function awaitCheckPosition() {
  try {
    await checkPosition();
  } catch (error) {
    console.error(
      "Could not update waitlist position:",
      error
    );
  }
}

function startAutomaticUpdates() {
  stopAutomaticUpdates();

  positionTimer = setInterval(
    awaitCheckPosition,
    5000
  );
}

function stopAutomaticUpdates() {
  if (positionTimer !== null) {
    clearInterval(positionTimer);
    positionTimer = null;
  }
}