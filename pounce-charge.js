// Verify state
if (!actor || !game.user.targets.ids[0] || game.user.targets.ids.length > 1) {
  ui.notifications.warn("You must be targeting a single token")
} else {
  pounce_charge()
}

async function get_height(total) {
  return Math.floor((total + Math.floor(((actor.system.attributes.speed.land.total - 30) / 10) *4)) /4)
}

async function pounce_charge() {
  // Roll the die
  const acrobatics_roll_attack = await actor.rollSkill('acr')
  let total_roll_attack = acrobatics_roll_attack.rolls[0].total

  // add 1/2 knowledge Plains ranks from https://www.aonprd.com/FeatDisplay.aspx?ItemName=Wind%20Leaper
  total_roll_attack += Math.floor(actor.system.skills.kpl.rank/2)

  const height = await get_height(total_roll_attack)

  // calulate for difference in height between actor and target
  const height_menu = await warpgate.menu({
    inputs: [{
      label: 'Enter height diifferential',
      type: 'text',
      options: '0'
    }],
    options: {
      width: '100px',
      height: '100%'
    }
  })

  const height_differential = (parseInt(height_menu.inputs[0]) == NaN) ? 0 : parseInt(height_menu.inputs[0])
  const total_height = height + height_differential + 10

  // calculate damage from height from https://aonprd.com/FeatDisplay.aspx?ItemName=Branch%20Pounce
  let height_target_damage = Math.floor(total_height/10)
  let height_self_damage = height_target_damage - 1

  // see if we reduce damage from falling
  const acrobatics_roll_fall = await actor.rollSkill('acr')
  const total_roll_fall = acrobatics_roll_fall.rolls[0].total
  if (total_roll_fall >= 15) {
    height_self_damage -= 1
  }

  // bind values
  if (height_target_damage > 20) height_target_damage = 20
  if (height_target_damage < 0) height_target_damage = 0
  if (height_self_damage > 20) height_self_damage = 20
  if (height_self_damage < 0) height_self_damage = 0

  // increment target damage from https://www.d20pfsrd.com/magic-items/magic-armor/specific-magic-armor/rhino-hide/
  height_target_damage += 2

  // output damage to target
  ChatMessage.create({
    content: `Bonus damage to ${game.user.targets.first().document.name} from falling from ${total_height}ft`,
  })
  const r = await new Roll(`${height_target_damage}d6`).evaluate({async: true});
  ChatMessage.create({
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    rolls:[r]
  });

  //output damage to self, reduced to all 1s by https://fvtt01.kronos-gaming.net/game
  ChatMessage.create({
    content: `Bonus damage to ${actor.name} from falling from ${total_height}ft`,
  })
  const u = await new Roll(`${height_self_damage}d1`).evaluate({async: true});
  ChatMessage.create({
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    rolls:[u]
  });
}