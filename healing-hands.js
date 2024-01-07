// Abe's special good touch macro

// Verify state
if (!actor || !game.user.targets.ids[0] || game.user.targets.ids.length > 1) {
  ui.notifications.warn("You must be targeting a single token");
} else {
  healersHands();
}

async function healersHands() {
  // https://www.aonprd.com/ArchetypeDisplay.aspx?FixedName=Rogue%20Phantom%20Thief
  // Get Phantom Thief level / 2 for Refined Education
  const rank_bonus = actor.classes.rogue.level / 2;

  // Roll the die
  const heal_roll = await actor.rollSkill("hea");

  console.log(heal_roll);
  // add heal mod to the d20 roll
  const heal_check = heal_roll.rolls[0].total;

  // get the target actor's HD total
  const target_hd = canvas.tokens.get(game.user.targets.ids[0]).actor.system
    .attributes.hd.total;

  // heal rank progression based upon table from
  // https://aonprd.com/Skills.aspx?ItemName=Heal
  const heal_rank_multiplier =
    // 20 Ranks: When you treat deadly wounds, the target recovers hit point and ability damage as if it had rested for 3 days with long-term care.
    actor.system.skills.hea.rank + rank_bonus >= 20
      ? 12
      : // 15 Ranks: When you treat deadly wounds, the creature recovers hit point and ability damage as if it had rested for 3 days.
        actor.system.skills.hea.rank + rank_bonus >= 15
        ? 6
        : // 10 Ranks: When you treat deadly wounds, the target recovers hit points as if it had rested for a full day with long-term care.
          actor.system.skills.hea.rank + rank_bonus >= 10
          ? 4
          : // 5 Ranks: When you treat deadly wounds, the target recovers hit points and ability damage as if it had rested for a full day.
            actor.system.skills.hea.rank + rank_bonus >= 5
            ? 2
            : 1;

  // get base heal amount
  let heal_amount = target_hd * heal_rank_multiplier;

  // construct the help text for the picky DM
  let results_title = `${target_hd}[Target Total HD] * ${heal_rank_multiplier}[Heal Rank Multiplier]}`;

  // if we surpass the Treat Wounds DC by 5 we add the Int mod of the caster
  // we add int because of https://www.aonprd.com/TraitDisplay.aspx?ItemName=Precise%20Treatment
  if (heal_check >= 25) {
    heal_amount += actor.system.abilities.int.mod;
    results_title += ` + ${actor.system.abilities.int.mod}[Intelligence Mod]`;
  }

  // if we surpass the Treat Wounds DC by 10 we add the rank in knowledge plains
  if (heal_check >= 30) {
    heal_amount += actor.system.skills.kpl.rank;
    results_title += ` + ${actor.system.skills.kpl.rank}[Knowledge Plains Rank]`;
  }

  // construct the output HTML
  let results_html = `<div class="message-content">
  <table>
  <thead>
    <tr>
      <th style="text-align:center" class="attack-flavor" colspan="2">Healer's Hands</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td class="lil-melded-type" colspan="2" style="text-align:center">
        <a
          class="inline-result lil-melded-roll"
          title="${results_title}"
        >
        ${heal_amount}
        </a>
      </td>
    </tr>
  </tbody>
  </table>
  <div class="pf1 chat-card damage-card heal">
    <div class="flexcol card-buttons">
          <div class="card-button-group flexcol">
              <label>Healing</label>
              <div class="flexrow">
                  <button type="button" data-action="applyDamage" data-value="-${heal_amount}">Apply</button>
              </div>
          </div>
      </div>
    </div>
  </div>
  `;

  // Create the chat message
  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({ token: actor }),
    content: results_html,
  });
}
