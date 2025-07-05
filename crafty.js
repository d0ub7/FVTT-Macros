// Abe's special crafty macro

// verify state
if (!actor) {
  ui.notifications.warn("Are you even real?");
} else {
  crafty();
}

async function crafty() {
  const cost = await warpgate.menu({
    inputs: [{
      label: `Crafting Cost (sp)`,
      type: 'number',
      value: 100
    }, {
      label: 'Crafting DC',
      type: 'number',
      value: 20
    }],
    buttons: [{
      label: 'craft',
      value: 1
    }
    ],
  },
    { title: ' Craft ' }
  );
  craftingCost = cost.inputs[0];
  craftingDC = cost.inputs[1];

  craftingCost = parseInt(craftingCost, 10);
  craftingDC = parseInt(craftingDC, 10);

  if (isNaN(craftingCost)) {
    ui.notifications.warn("Crafting cost must be a number");
    return;
  }
  if (isNaN(craftingDC)) {
    ui.notifications.warn("Crafting DC must be a number");
    return;
  }

  // roll the craft skill
  craftRoll = await actor.rollSkill("crf.subSkills.crf1");
  craftCheck = craftRoll.rolls[0].total


  let craftingOutput = 0
  // base
  craftingOutput = craftCheck * craftingDC
  // skill unlock
  craftingOutput = craftingOutput * 2
  // cooperative crafting
  craftingOutput = craftingOutput * 2

  let result
  if (craftingOutput < craftingCost) {
    result = `<span class="lil-melded-roll">Failed to craft, you need ${craftingCost} sp, but only rolled ${craftingOutput}.</span>`;
  } else if (craftingOutput >= craftingCost * 2) {
    const multiple = Math.floor(craftingOutput / craftingCost);
    result = `<span class="lil-melded-roll">Crafted ${multiple} items, you crafted ${craftingOutput} against a cost of ${craftingCost} sp.</span>`;
  } else if (craftingOutput >= craftingCost) {
    result = `<span class="lil-melded-roll">Crafted, you crafted ${craftingOutput} against a cost of ${craftingCost} sp.</span>`;
  }

  let results_html = `<div class="message-content">
  <table>
  <thead>
    <tr>
      <th style="text-align:center" class="attack-flavor" colspan="2">Crafting Progress</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td class="lil-melded-type" colspan="2" style="text-align:center">
        <a
          class="inline-result lil-melded-roll"
          title="Crafting Progress"
        >
        ${result}
        </a>
      </td>
    </tr>
  </tbody>
  </table>
  `;

  // Create the chat message
  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({ token: actor }),
    content: results_html,
  });

}
