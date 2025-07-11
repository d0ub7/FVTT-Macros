/**
 * Swarm Shape macro for Swarm Monger druid
 * Macro assumes you have Energized Claws + Planar Wild Shape
 * Assumes you have an attack with it's 0th action both named Swarm
 */

// globals
const SOURCE = "Wild Shape";
const ENERGIZED = ["acid", "cold", "electric", "fire"];
const SPELLLEVEL = 6
const DIFFICULTYCLASS = 10 + SPELLLEVEL + actor.system.abilities.wis.mod;
const DRUIDLEVEL = actor.items.find(
  (o) => o.type === "class" && o.name === "Druid",
)?.system.level;

// templates object
const TEMPLATES = {
  clestial: {
    template: {
      senses: {
        dv: 60,
      },
      sr: actor.system.attributes.hd.total + 5 + 1,
      eres: [
        { amount: 15, type: "cold" },
        { amount: 15, type: "acid" },
        { amount: 15, type: "electric" },
      ],
      dr: [{ amount: 10, type: "evil" }],
    },
  },
  fiendish: {
    template: {
      senses: {
        dv: 60,
      },
      sr: actor.system.attributes.hd.total + 5 + 1,
      eres: [
        { amount: 15, type: "cold" },
        { amount: 15, type: "fire" },
      ],
      dr: [{ amount: 10, type: "good" }],
    },
  },
};

// size changes object
const CHANGES = {
  fine: {
    changes: [
      {
        formula: "8",
        operator: "add",
        target: "ability",
        subTarget: "dex",
        modifier: "size",
        priority: 0,
        value: 6,
      },
      {
        formula: "-6",
        operator: "add",
        target: "ability",
        subTarget: "str",
        modifier: "size",
        priority: 0,
        value: -4,
      },
      {
        formula: "1",
        operator: "add",
        subTarget: "nac",
        modifier: "untyped",
        priority: 0,
        value: 1,
      },
    ],
  },
  dim: {
    changes: [
      {
        formula: "6",
        operator: "add",
        target: "ability",
        subTarget: "dex",
        modifier: "size",
        priority: 0,
        value: 6,
      },
      {
        formula: "-4",
        operator: "add",
        target: "ability",
        subTarget: "str",
        modifier: "size",
        priority: 0,
        value: -4,
      },
      {
        formula: "1",
        operator: "add",
        subTarget: "nac",
        modifier: "untyped",
        priority: 0,
        value: 1,
      },
    ],
  },
  tiny: {
    changes: [
      {
        formula: "4",
        operator: "add",
        target: "ability",
        subTarget: "dex",
        modifier: "size",
        priority: 0,
        value: 4,
      },
      {
        formula: "-2",
        operator: "add",
        target: "ability",
        subTarget: "str",
        modifier: "size",
        priority: 0,
        value: -2,
      },
      {
        formula: "1",
        operator: "add",
        subTarget: "nac",
        modifier: "untyped",
        priority: 0,
        value: 1,
      },
    ],
  },
};

// form change object
const FORMS = {
  ants: {
    mult: 10,
    size: "fine",
    speed: {
      land: 30,
      climb: 30,
    },
    senses: {
      dv: 60,
      scent: true,
      custom: "Scent",
    },
    sp: [
      {
        type: "ref",
        dc: DIFFICULTYCLASS,
        description: `If a creature leaves an army ant swarm’s square, the swarm suffers 1d6 points of damage to reflect the loss of its numbers as several of the crawling pests continue to cling tenaciously to the victim. A creature with army ants clinging to him takes 3d6 points of damage at the end of his turn each round. As a full-round action, he can remove the ants with a DC ${DIFFICULTYCLASS
          } Reflex save. High wind or any amount of damage from an area effect destroys all clinging ants.`,
      },
      {
        description: `An army ant swarm can rapidly consume any creature it swarms over. Against helpless or nauseated targets, an army ant swarm attack deals 6d6 points of damage.`,
      },
    ],
    di: ["weapon damage", "mind-affecting effects"],
  },
  leeches: {
    mult: 8,
    size: "dim",
    speed: {
      land: 5,
      swim: 30,
    },
    senses: {
      bs: 30,
    },
    sp: [
      {
        description:
          "Any living creature that begins its turn with a leech swarm in its space is drained of its blood and takes 1d3 points of Str and Con damage. ",
      },
      {
        dc: DIFFICULTYCLASS,
        type: "fort",
        description:
          `Fortitude DC ${DIFFICULTYCLASS}; frequency 1/round for 2 rounds; effect 1d4 Dexterity drain; cure 1 save.`,
      },
    ],
    di: ["weapon damage", "mind-affecting effects"],
  },
  centipedes: {
    mult: 8,
    size: "dim",
    speed: {
      land: 30,
      climb: 30,
    },
    senses: {
      dv: 60,
      ts: 30,
    },
    sp: [
      {
        dc: DIFFICULTYCLASS,
        type: "fort",
        description: `Fortitude DC ${DIFFICULTYCLASS
          }; frequency 1/round for 6 rounds; effect 1d4 Dex damage; cure 1 save.`,
      },
    ],
    di: ["weapon damage", "mind-affecting effects"],
  },
  wasps: {
    mult: 6,
    size: "dim",
    speed: {
      land: 5,
      fly: 40,
    },
    senses: {
      dv: 60,
    },
    sp: [
      {
        dc: DIFFICULTYCLASS,
        type: "fort",
        description: `Fortitude DC ${DIFFICULTYCLASS
          }; frequency 1/round for 4 rounds; effect 1 Dexterity damage; cure 1 save.`,
      },
    ],
    di: ["weapon damage", "mind-affecting effects"],
  },
  crabs: {
    mult: 6,
    size: "dim",
    speed: {
      land: 30,
      swim: 20,
    },
    senses: {
      dv: 60,
    },
    di: ["weapon damage", "mind-affecting effects"],
  },
  rats: {
    mult: 4,
    size: "tiny",
    speed: {
      land: 15,
      swim: 15,
      climb: 15,
    },
    senses: {
      ll: true,
      scent: true,
      custom: "Scent",
    },
    sp: [
      {
        dc: DIFFICULTYCLASS,
        type: "fort",
        description: `Filth fever: Fortitude DC ${DIFFICULTYCLASS
          }; onset 1d3 days; frequency 1/day; effect 1d3 Dex damage and 1d3 Con damage; cure 2 consecutive saves.`,
      },
    ],
  },
  spiders: {
    mult: 2,
    size: "dim",
    speed: {
      land: 20,
      climb: 20,
    },
    di: ["weapon damage", "mind-affecting effects"],
    senses: {
      dv: 60,
      ts: 30,
    },
    sp: [
      {
        dc: DIFFICULTYCLASS,
        type: "fort",
        description: `Fortitude DC ${DIFFICULTYCLASS
          }; frequency 1/round for 2 rounds; effect 1d2 Str; cure 1 save.`,
      },
    ],
  },
};


// verify state
if (!actor) {
  ui.notifications.warn("Are you even real?");
} else {
  wildShape();
}



/**
 * setItemsStatus
 * @param {boolean} value - true to set items to active, false to set to inactive
 */
async function setItemsStatus(value) {
  // get all items
  // reverse the boolean value to match the system
  const oppositeValue = value ? "true" : "false";
  const items = actor.collections.items.filter(
    (o) => o.type === "equipment" || o.system.carried === oppositeValue.toString(),
  );

  // set active/inactive
  const updates = [];
  for (const item of items) {
    updates.push({
      _id: item.id,
      "system.carried": value,
    });
  }

  // update items
  await actor.updateEmbeddedDocuments("Item", updates);
}


/**
 * swarmShape
 * @param {string} form - the form to change into
 * @param {string} template - the template to apply
 * @param {string} energy - the energy to apply
 */
async function swarmShape(form, template, energy) {
  // organize data objects
  let chatMessage = "";
  let changeData = {};
  let buffActive = true;
  const buffChanges = [];
  const itemsToEmbed = [];
  if (form == actor.name) {
    changeData = { size: "sm", template: {} };
    buffActive = false
    setItemsStatus(true);
    chatMessage = `${actor.name} reverts to her natural form`;
  } else {
    const formData = FORMS[form];
    const templateData = TEMPLATES[template];
    const sizeData = CHANGES[formData.size];
    changeData = { ...formData, ...templateData, ...sizeData };
    changeData.changes.forEach((element) => {
      buffChanges.push(element);
    });
    setItemsStatus(false);
    const numSwarm = Math.floor(DRUIDLEVEL / changeData.mult);
    const suffix = numSwarm == 1 ? "swarm" : "swarms";
    chatMessage = `Iselda transforms into ${numSwarm} ${suffix} of ${template} ${energy} ${form}`;
  }

  // create buff if it does not exist
  // only exists to sync with mightyMorphin since it deletes buff
  let buff = actor.collections.items.find(
    (o) => o.type === "buff" && o.name === SOURCE,
  );

  if (!buff) {
    let buffData = { system: {} };
    buffData.system = duplicate(game.system.template.Item.buff);
    for (let t of buffData.system.templates) {
      mergeObject(
        buffData.system,
        duplicate(game.system.template.Item.templates[t]),
      );
    }
    delete buffData.system.templates;

    buffData.name = SOURCE;
    buffData.type = "buff";
    buffData.img = "systems/pf1/icons/spells/wild-jade-3.jpg";

    itemsToEmbed.push(buffData);
  }

  // set duration of buff
  let durationData = {
    value: actor.system.attributes.hd.total.toString(),
    units: "hour",
  };

  // set speeds inside buff
  const newSpeeds = duplicate(actor.system.attributes.speed);
  const speedTypes = Object.keys(newSpeeds);
  if (!!changeData.speed) {
    for (let i = 0; i < speedTypes.length; i++) {
      // Find the speed the form gives for the type
      let speed = changeData.speed[speedTypes[i]];
      let speedChange = {
        formula: "0",
        operator: "set",
        subTarget: speedTypes[i] + "Speed",
        modifier: "base",
        priority: 100,
        value: 0,
      };
      if (!!speed) {
        // if the form has this speed add it
        speedChange.formula = speed.toString();
        speedChange.value = speed;
      }
      buffChanges.push(speedChange);
    }
  }

  // set SR in buff
  if (!!changeData.template.sr) {
    let srChange = {
      formula: changeData.template.sr,
      operator: "set",
      subTarget: "spellResist",
      modifier: "untyped",
      priority: 100,
      value: changeData.template.sr,
    };
    buffChanges.push(srChange);
  }

  // reget buff and set data
  buff = actor.collections.items.find(
    (o) => o.type === "buff" && o.name === SOURCE,
  );
  let buffUpdate = [
    {
      _id: buff.id,
      "system.duration": durationData,
      "system.changes": buffChanges,
      "system.active": buffActive,
    },
  ];

  // set not a halfling buff
  let buffTwo = actor.collections.items.find(
    (o) => o.type === "buff" && o.name === "not a halfling",
  );
  buffUpdate.push({
    _id: buffTwo.id,
    "system.active": buffActive,
  });

  let attack = actor.collections.items.find(
    (o) => o.type === "attack" && o.name === "Swarm",
  );
  let tempAttack = duplicate(attack.system.actions);

  tempAttack[0].attackNotes = "";
  tempAttack[0].save = {};

  // add energized claws damage to swarm attack
  let partObject = {
    formula: "1d6",
    type: {
      values: [`${energy}`],
      custom: "",
    },
  };
  // add energized claws effects to swarmattack
  tempAttack[0].damage.parts[1] = partObject;
  if (!!changeData.sp) {
    changeData.sp.forEach((element) => {
      if (!element.dc) {
        tempAttack[0].attackNotes = element.description;
      } else {
        tempAttack[0].save = element;
      }
    });
  }

  // organize attack data
  let attackUpdate = [
    {
      _id: attack.id,
      "system.actions": tempAttack,
    },
  ];

  // get senses
  let senseObject = {
    bs: 0,
    bse: 0,
    custom: "",
    dv: 0,
    ll: { enabled: false, multiplier: { dim: 2, bright: 2 } },
    sc: false,
    scent: false,
    si: false,
    sid: false,
    tr: false,
    ts: 0,
  };
  let newSenses = { ...senseObject, ...changeData.senses };

  // get elemental resists
  let newEres = {
    value: [],
    custom: "",
  };
  if (!!changeData.template.eres) {
    let elementHandled = false;
    changeData.template.eres.forEach((element) => {
      if (energy == element.type) {
        element.amount += 5;
        elementHandled = true;
      }
      newEres.value.push({
        amount: element.amount,
        types: [element.type, ""],
        operator: "true",
      });
    });
    if (!elementHandled) {
      newEres.value.push({
        amount: 10,
        types: [energy, ""],
        operator: "true",
      });
    }
    newEres.custom = newEres.custom.trim();
  }

  // get damage reductions
  let newDr = {
    value: [],
    custom: "",
  };
  if (!!changeData.template.dr) {
    changeData.template.dr.forEach((element) => {
      newDr.custom += `${element.amount}/${element.type}`;
    });
  }

  // get damage immunities
  let newDi = "";
  if (!!changeData.di) {
    changeData.di.forEach((element) => {
      newDi += element + " ";
    });
    newDi = newDi.trim();
  }

  // create object to merge
  const objectToMerge = {
    size: changeData.size,
    eres: newEres,
    dr: newDr,
    "di.custom": newDi,
    senses: newSenses,
  };

  // update actor
  await actor.createEmbeddedDocuments("Item", itemsToEmbed);
  await actor.updateEmbeddedDocuments("Item", attackUpdate);
  await actor.updateEmbeddedDocuments("Item", buffUpdate);
  await actor.update(mergeObject({ "system.traits": objectToMerge }));

  // create chat message
  await ChatMessage.create({ content: chatMessage });
}


/**
 * wildShape
 * Entry point for the macro
 */
async function wildShape() {


  // generate foundry form data
  const inputs = [];
  const buttons = [];

  // generate template dropdown
  const templateOptions = [];
  let templateValue = { type: "select", label: "template" };
  for (const template in TEMPLATES) {
    let value = {
      html: template,
      value: { template: template },
    };
    templateOptions.push(value);
  }
  templateValue.options = templateOptions;
  inputs.push(templateValue);

  // generate energy dropdown
  const energizedOptions = [];
  let energizedValue = { type: "select", label: "element" };
  ENERGIZED.forEach(function(element) {
    let value = {
      html: element,
      value: { element: element },
    };
    energizedOptions.push(value);
  });
  energizedValue.options = energizedOptions;
  inputs.push(energizedValue);

  // generate wild shape form buttons
  for (const form in FORMS) {
    let value = {};
    value = {
      label: form,
      value: form,
    };
    buttons.push(value);
  }

  // generate revert button
  let revertButton = {
    label: actor.name,
    value: actor.name,
  };
  buttons.push(revertButton);

  let formData = {};
  formData.inputs = inputs;
  formData.buttons = buttons;
  if (!!formData) {
    // generate form and pass info to swarmShape
    const choice = await warpgate.menu(formData);
    const form = choice.buttons;
    const template = choice.inputs[0].template;
    const element = choice.inputs[1].element;
    await swarmShape(form, template, element);
  }
}

