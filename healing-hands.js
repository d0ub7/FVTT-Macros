// Abe's special good touch macro

let r = new Roll("1d20");

// The parsed terms of the roll formula
console.log(r.terms); // [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]

// Execute the roll
r.evaluate({ async: false });

// The resulting equation after it was rolled
console.log(r.result);

// The total resulting from the roll
console.log(r.total);

let heal_check = r.total + actor.data.data.skills.hea.mod;

// change this when you need to multiply your character
// level by a different value based on progression
let level_multiplier = 2;

// this should be the targets level, using personal level for now because of simplicity
let heal_amount = actor.data.data.attributes.hd.total * level_multiplier;
let results_title = `${actor.data.data.attributes.hd.total}[Total HD] * ${level_multiplier}[level multiplier]}`;

console.log(heal_amount);
if (heal_check >= 20) {
  heal_amount += actor.data.data.abilities.int.mod;
  results_title += ` + ${actor.data.data.abilities.int.mod}[Intelligence Mod]`;
}
console.log(heal_amount);
if (heal_check >= 25) {
  heal_amount += actor.data.data.skills.kpl.rank;
  results_title += ` + ${actor.data.data.skills.kpl.rank}[Knowledge Plains Rank]`;
}
console.log(heal_amount);
let results_html = `<table>
<thead>
  <tr>
    <th class="attack-flavor" colspan="2">Healer's Hands</th>
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
      <a class="inline-action" data-action="applyDamage" data-value="-${heal_amount}" title="Apply Healing" data-tags="">
        <i class="fas fa-seedling"></i>
        <i class="absolute fas fa-plus"></i>
      </a>
    </td>
  </tr>
</tbody>
</table>
`;

ChatMessage.create({
  user: game.user._id,
  speaker: ChatMessage.getSpeaker({ token: actor }),
  content: results_html,
});