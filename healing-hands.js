// Abe's special good touch macro

// Verify state
if (!actor || !game.user.targets.ids[0] || game.user.targets.ids.length > 1) {
  ui.notifications.warn("You must be targeting a single token")
} else {
  healersHands()
}

function healersHands() {
  // Roll the die
  let r = new Roll("1d20");
  r.evaluate({ async: false });

  // add heal mod to the d20 roll
  let heal_check = r.total + actor.data.data.skills.hea.mod;

  // get the target actor's HD total
  let target_actor = canvas.tokens.get(game.user.targets.ids[0]).actor
  let target_hd = target_actor.data.data.attributes.hd.total

  // change this when you need to multiply your character
  // level by a different value based on progression
  let level_multiplier = 2;

  // get base heal amount
  let heal_amount = target_hd * level_multiplier;

  // construct the help text for the picky DM
  let results_title = `${target_hd}[Target Total HD] * ${level_multiplier}[level multiplier]}`;

  // if we surpass the Treat Wounds DC by 5 we add the Int mod of the caster
  if (heal_check >= 20) {
    heal_amount += actor.data.data.abilities.int.mod;
    results_title += ` + ${actor.data.data.abilities.int.mod}[Intelligence Mod]`;
  }

  // if we surpass the Treat Wounds DC by 10 we add the rank in knowledge plains
  if (heal_check >= 25) {
    heal_amount += actor.data.data.skills.kpl.rank;
    results_title += ` + ${actor.data.data.skills.kpl.rank}[Knowledge Plains Rank]`;
  }

  // construct the output HTML
  let results_html = `<table>
  <thead>
    <tr>
      <th style="text-align:center" class="attack-flavor" colspan="2">Healer's Hands</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td colspan="4" style="text-align:center">
        <a
          class="inline-roll inline-dsn-hidden inline-result decent-roll lil-expanded-inline-roll lil-enhanced-roll"
          title="1d20 + ${actor.data.data.skills.hea.mod}[Heal Modifier]"
          data-roll-natural="${r.total}"
        >
          <span class="lil-roll roll die d20">${r.total}</span
          ><span class="lil-bonus">+${actor.data.data.skills.hea.mod}</span
          ><span class="lil-arrow">⇒</span
          ><span class="lil-total">${heal_check}</span></a
        >
      </td>
    </tr>

    <tr>
      <td class="lil-melded-type" colspan="2" style="text-align:center">
        <a
          class="inline-roll inline-dsn-hidden inline-result middling-roll lil-melded-roll"
          title="${results_title}"
        >
          ${heal_amount}
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
