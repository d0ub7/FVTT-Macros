//Aberrius' Alchemical Crafting Woskshop w Journal Logging

if (!actor) {
  ui.notifications.warn("No actor selected.");
} else {
  batchCraft();
}

async function batchCraft() {
  const { inputs } = await warpgate.menu({
    inputs: [
      { label: "Item Cost (gp)", type: "number", value: 250 },
      { label: "Craft DC (include +10 if accelerated)", type: "number", value: 30 },
      { label: "Number of Items to Craft (max 25)", type: "number", value: 10 },
      { label: "Use Cyclops Helm for first item?", type: "checkbox", value: true }
    ],
    buttons: [{ label: "Craft!", value: "craft" }]
  }, { title: "Batch Crafting (Alchemy)" });

  const costPerItem = parseFloat(inputs[0]);
  const dc = parseInt(inputs[1]);
  const quantity = Math.min(25, parseInt(inputs[2]));
  const useCyclops = inputs[3];

  if (isNaN(costPerItem) || isNaN(dc) || isNaN(quantity)) {
    ui.notifications.warn("Please enter valid numbers.");
    return;
  }

  const skill = actor.system.skills?.crf?.subSkills?.crf1;
  const craftMod = skill?.mod;

  if (typeof craftMod !== 'number') {
    ui.notifications.error("Unable to read Craft (Alchemy) modifier from crf1.");
    return;
  }

  let totalTime = 0;
  let outputRows = "";
  let failedItems = [];

  const fluffQuotes = [
    "The cauldron bubbles with possibility...",
    "Aberrius’s fingers trace arcane sigils into the mist...",
    "The smell of brimstone and lavender fills the air...",
    "Each measurement precise, each moment etched in ritual...",
    "Aether shimmers along the glassware’s edge..."
  ];
  const randomFluff = fluffQuotes[Math.floor(Math.random() * fluffQuotes.length)];

  for (let i = 0; i < quantity; i++) {
    const dieRoll = (i === 0 && useCyclops) ? 20 : new Roll("1d20").roll({ async: false }).total;
    const checkTotal = dieRoll + craftMod;
    const progress = checkTotal * dc * 2 * 2;
    const time = costPerItem / progress;
    const cappedTime = Math.min(time, 1);
    totalTime += cappedTime;

    const completed = progress >= costPerItem;
    const isCrit = dieRoll === 20;
    const isOverperform = progress >= costPerItem * 2;

    let rowColor = (i % 2 === 0) ? "#f4f4f4" : "#e4e4e4";
    if (!completed) rowColor = "#ffe6e6";
    if (isCrit && completed) rowColor = "#fff4cc";
    if (isOverperform) rowColor = "#e6ffe6";
    if (isCrit && !completed) rowColor = "#ffd4cc";

    const hours = Math.floor(cappedTime * 8);
    const minutes = Math.round((cappedTime * 8 - hours) * 60);
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

    if (!completed) {
      const remainingValue = costPerItem - progress;
      const remainingTime = remainingValue / (checkTotal * dc * 2 * 2);
      failedItems.push({
        index: i + 1,
        remainingValue: remainingValue.toFixed(1),
        remainingTime: `${Math.floor(remainingTime * 8)}:${String(Math.round((remainingTime * 8 % 1) * 60)).padStart(2, '0')}`
      });
    }

    outputRows += `
      <tr style="background-color:${rowColor};">
        <td style="border: 1px solid #999; text-align:center;">${i + 1}</td>
        <td style="border: 1px solid #999; text-align:center;">${dieRoll}</td>
        <td style="border: 1px solid #999; text-align:center;">${craftMod}</td>
        <td style="border: 1px solid #999; text-align:center;">${checkTotal}</td>
        <td style="border: 1px solid #999; text-align:center;"><strong>${progress.toFixed(1)}</strong></td>
        <td style="border: 1px solid #999; text-align:center;">${formattedTime}</td>
      </tr>`;
  }

  const totalHours = Math.floor(Math.min(totalTime, 1) * 8);
  const totalMinutes = Math.round((Math.min(totalTime, 1) * 8 - totalHours) * 60);
  const totalFormatted = `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;

  let footerReport = "";
  if (failedItems.length > 0) {
    const first = failedItems[0];
    footerReport = `
      <div style="margin-top:10px; color: #a00; font-weight: bold;">
        ⚠ Some items were not completed in today’s 8-hour window.<br>
        Remaining crafting needed:<br>
        <ul style="margin: 4px 0 0 16px; color: #a00;">
          ${failedItems.map(f => `<li>Item #${f.index}: ${f.remainingValue} gp (${f.remainingTime} remaining)</li>`).join("")}
        </ul>
        <div style="margin-top: 6px; font-size: 13px; user-select:none; color: black;">
          Click to continue crafting tomorrow: 
          <span 
            class="continue-craft" 
            data-index="${first.index}" 
            data-remaining="${first.remainingValue}" 
            data-dc="${dc}" 
            data-craftmod="${craftMod}"
            data-originalcost="${costPerItem}"
            title="Continue crafting this unfinished item"
            style="cursor: pointer; color: #007bff;"
          >🔨</span>
        </div>
      </div>`;
  } else {
    footerReport = `<div style="margin-top:10px; color: #0a0; font-weight: bold;">✅ All items completed within today’s crafting time.</div>`;
  }

  const output = `
    <div class="message-content" style="font-size:13px; font-family:Segoe UI, sans-serif;">
      <div style="margin-bottom: 8px; font-style: italic; color: #888; text-align: center;">${randomFluff}</div>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th colspan="6" style="text-align:center; font-size: 16px; padding: 10px; background: radial-gradient(circle, #441144, #000); color: #f8f8f8; border-bottom: 2px solid #999;">
              🧪<em>Aberrius's Workshop</em>🧪
            </th>
          </tr>
          <tr style="background-color:#444; color:#fff;">
            <th style="border: 1px solid #666; padding: 4px;">#</th>
            <th style="border: 1px solid #666; padding: 4px;">🎲</th>
            <th style="border: 1px solid #666; padding: 4px;">Bonus</th>
            <th style="border: 1px solid #666; padding: 4px;">Total</th>
            <th style="border: 1px solid #666; padding: 4px;">Crafted Value</th>
            <th style="border: 1px solid #666; padding: 4px;">Time</th>
          </tr>
        </thead>
        <tbody>
          ${outputRows}
          <tr style="background-color:#ddd;">
            <td colspan="5" style="text-align:right; border: 1px solid #999; padding: 6px;"><strong>Total Time:</strong></td>
            <td style="border: 1px solid #999; text-align:center;"><strong>${totalFormatted}</strong></td>
          </tr>
        </tbody>
      </table>
      ${footerReport}
      <div style="margin-top: 8px; font-size: 12px; color: #007bff; cursor: pointer; display: inline-block;" 
           class="open-crafting-log" title="Open Crafting Log journal 📖">📖</div>
    </div>
  `;

  await ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: output
  });

  // Append to journal log
  const timestamp = new Date().toLocaleString();
  const journalEntry = game.journal.find(j => j.name === "Aberrius");
  if (!journalEntry) return console.warn("Journal Entry 'Aberrius' not found.");

  const logPage = journalEntry.pages.find(p => p.name === "Crafting Log");
  if (!logPage) return ui.notifications.warn("Page 'Crafting Log' not found in journal.");

  const batchLogHTML = `
    <hr><h3>Crafting Batch - ${timestamp}</h3>
    <p><strong>Items:</strong> ${quantity} | <strong>Cost per Item:</strong> ${costPerItem} gp | <strong>DC:</strong> ${dc}</p>
    <table style="border-collapse: collapse; width: 100%; font-size: 13px;">
      <thead>
        <tr style="background-color:#444; color:#fff;">
          <th style="border: 1px solid #666; padding: 4px;">#</th>
          <th style="border: 1px solid #666; padding: 4px;">Roll</th>
          <th style="border: 1px solid #666; padding: 4px;">Bonus</th>
          <th style="border: 1px solid #666; padding: 4px;">Total</th>
          <th style="border: 1px solid #666; padding: 4px;">Crafted Value</th>
          <th style="border: 1px solid #666; padding: 4px;">Time</th>
        </tr>
      </thead>
      <tbody>
        ${outputRows}
      </tbody>
    </table>
    <p style="margin-top: 6px;">${failedItems.length > 0
      ? `<span style="color: #a00;">⚠ Some items unfinished.</span>`
      : `<span style="color: #0a0;">✅ All items completed.</span>`}</p>
  `;

  const currentContent = logPage.text.content || "";
  await logPage.update({ "text.content": currentContent + batchLogHTML });
}

// Listener for continue crafting and journal open buttons
(() => {
  if (window._batchCraftListenerRegistered) return;
  window._batchCraftListenerRegistered = true;

  Hooks.on("renderChatMessage", (message, html) => {
    // Continue crafting hammer click
    html.find("span.continue-craft").click(async (event) => {
      event.preventDefault();
      const el = event.currentTarget;

      const index = el.dataset.index;
      const remainingValue = parseFloat(el.dataset.remaining);
      const dc = parseInt(el.dataset.dc);
      const craftMod = parseInt(el.dataset.craftmod);
      const originalCost = parseFloat(el.dataset.originalcost);



      // Cyclops Helm prompt
      const useCyclops = await new Promise((resolve) => {
        new Dialog({
          title: "Cyclops Helm",
          content: `<p>Do you want to use the Cyclops Helm for this crafting roll?</p>`,
          buttons: {
            yes: { label: "Yes", callback: () => resolve(true) },
            no: { label: "No", callback: () => resolve(false) }
          },
          default: "no"
        }).render(true);
      });

      // Roll Craft Check
      const dieRoll = useCyclops ? 20 : (await new Roll("1d20").roll({ async: true })).total;
      const checkTotal = dieRoll + craftMod;
      const progress = checkTotal * dc * 2 * 2;
      const cappedProgress = Math.min(progress, remainingValue);
      const remainingAfter = Math.max(remainingValue - progress, 0);

      // Calculate time
      const time = cappedProgress / (checkTotal * dc * 2 * 2);
      const cappedTime = Math.min(time, 1);
      const hours = Math.floor(cappedTime * 8);
      const minutes = Math.round((cappedTime * 8 - hours) * 60);
      const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

      // Output continuation message
      let continuationContent = `
        <div style="font-family:Segoe UI, sans-serif; font-size:13px;">
          <p><strong>Crafting continuation for Item #${index}</strong></p>
          <p>Roll: <strong>${dieRoll}</strong> + Bonus: <strong>${craftMod}</strong> = Total: <strong>${checkTotal}</strong></p>
          <p>Progress this roll: <strong>${cappedProgress.toFixed(1)}</strong> gp</p>
          <p>Total progress so far: <strong>${(originalCost - remainingAfter).toFixed(1)} / ${originalCost.toFixed(1)}</strong> gp</p>
          <p>Time used: <strong>${formattedTime}</strong> hours</p>`;

      if (remainingAfter > 0) {
        continuationContent += `
          <p style="color:#a00; font-weight:bold;">
            ⚠ Item not yet finished.<br>
            Remaining crafting: ${remainingAfter.toFixed(1)} gp.
          </p>
          <div style="user-select:none; color:black;">
            Continue crafting tomorrow: 
            <span 
              class="continue-craft" 
              data-index="${index}" 
              data-remaining="${remainingAfter.toFixed(1)}" 
              data-dc="${dc}" 
              data-craftmod="${craftMod}"
              data-originalcost="${originalCost}"
              style="cursor:pointer; color:#007bff;"
              title="Continue crafting this unfinished item"
            >🔨</span>
          </div>`;
      } else {
        continuationContent += `<p style="color:#0a0; font-weight:bold;">✅ Item finished!</p>`;
      }
      continuationContent += `</div>`;

      await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: continuationContent
      });

      // Append continuation to journal
      const journalEntry = game.journal.find(j => j.name === "Aberrius");
      if (!journalEntry) return ui.notifications.warn("Journal entry 'Aberrius' not found.");

      const logPage = journalEntry.pages.find(p => p.name === "Crafting Log");
      if (!logPage) return ui.notifications.warn("Page 'Crafting Log' not found.");

      const timestamp = new Date().toLocaleString();
      const logHtml = `
        <hr>
        <h4>Crafting continuation - Item #${index} - ${timestamp}</h4>
        <p>Roll: ${dieRoll} + Bonus: ${craftMod} = Total: ${checkTotal}</p>
        <p>Progress this roll: ${cappedProgress.toFixed(1)} gp</p>
        <p>Total progress: ${(originalCost - remainingAfter).toFixed(1)} / ${originalCost.toFixed(1)} gp</p>
        <p>Time used: ${formattedTime} hours</p>
        ${remainingAfter > 0 ? `<p style="color:#a00;">Remaining crafting: ${remainingAfter.toFixed(1)} gp</p>` : `<p style="color:#0a0;">Item finished!</p>`}
      `;
      const currentContent = logPage.text.content || "";
      await logPage.update({ "text.content": currentContent + logHtml });
    });

    // Open crafting log journal page
    html.find("div.open-crafting-log").click((event) => {
      event.preventDefault();
      const journalEntry = game.journal.find(j => j.name === "Aberrius");
      if (!journalEntry) {
        ui.notifications.warn("Journal entry 'Aberrius' not found.");
        return;
      }
      const logPage = journalEntry.pages.find(p => p.name === "Crafting Log");
      if (!logPage) {
        ui.notifications.warn("Page 'Crafting Log' not found.");
        return;
      }
      logPage.sheet.render(true);
    });
  });
})();
