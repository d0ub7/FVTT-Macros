if (!actor) {
  ui.notifications.warn("Are you even real?");
} else {
  wildShape();
}

async function wildShape() {
  let druidLevel = actor.items.find(
    (o) => o.type === "class" && o.name === "Druid",
  )?.system.level;

  const source = "Wild Shape";
  let newSpeeds = duplicate(actor.system.attributes.speed);
  let speedTypes = Object.keys(newSpeeds);
  const energized = ["acid", "cold", "electricity", "fire"];
  const templates = {
    clestial: {
      template: {
        senses: {
          dv: 60,
        },
        sr: actor.system.attributes.hd.total + 5,
        eres: [
          { amount: 15, type: "cold" },
          { amount: 15, type: "acid" },
          { amount: 15, type: "electricity" },
        ],
        dr: [{ amount: 10, type: "evil" }],
      },
    },
    fiendish: {
      template: {
        senses: {
          dv: 60,
        },
        sr: actor.system.attributes.hd.total + 5,
        eres: [
          { amount: 15, type: "cold" },
          { amount: 15, type: "fire" },
        ],
        dr: [{ amount: 10, type: "good" }],
      },
    },
  };

  const changes = {
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
          modifier: "untyped",
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
          modifier: "untyped",
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
          modifier: "untyped",
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

  const forms = {
    ant: {
      mult: 10,
      size: "fine",
      speed: {
        land: 30,
        climb: 30,
      },
      senses: {
        dv: 60,
        scent: true,
      },
      sp: [
        {
          dc: 15 + actor.system.abilities.dex.mod,
          type: "ref",
          description: `If a creature leaves an army ant swarm’s square, the swarm suffers 1d6 points of damage to reflect the loss of its numbers as several of the crawling pests continue to cling tenaciously to the victim. A creature with army ants clinging to him takes 3d6 points of damage at the end of his turn each round. As a full-round action, he can remove the ants with a DC ${
            15 + actor.system.abilities.dex.mod
          } Reflex save. High wind or any amount of damage from an area effect destroys all clinging ants.`,
        },
        {
          description: `An army ant swarm can rapidly consume any creature it swarms over. Against helpless or nauseated targets, an army ant swarm attack deals 6d6 points of damage.`,
        },
      ],
      di: ["weapon damage", "mind-affecting effects"],
    },

    leech: {
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
          dc: 15,
          type: "fort",
          description:
            "save Fort DC 15; frequency 1/round for 2 rounds; effect 1d4 Dexterity drain; cure 1 save.",
        },
      ],
      di: ["weapon damage", "mind-affecting effects"],
    },

    centipede: {
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
          dc: 10 + actor.system.abilities.con.mod,
          type: "fort",
          description: `save Fortitude DC ${
            10 + actor.system.abilities.con.mod
          }; frequency 1/round for 6 rounds; effect 1d4 Dex damage; cure 1 save.`,
        },
      ],
      di: ["weapon damage", "mind-affecting effects"],
    },

    wasp: {
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
          dc: 13 + actor.system.abilities.con.mod,
          type: "fort",
          description: `save Fort DC ${
            13 + actor.system.abilities.con.mod
          }; frequency 1/round for 4 rounds; effect 1 Dexterity damage; cure 1 save.`,
        },
      ],
      di: ["weapon damage", "mind-affecting effects"],
    },

    crab: {
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

    rat: {
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
      },
      sp: [
        {
          dc: 11 + actor.system.abilities.con.mod,
          type: "fort",
          description: `Filth fever: save Fort DC ${
            11 + actor.system.abilities.con.mod
          }; onset 1d3 days; frequency 1/day; effect 1d3 Dex damage and 1d3 Con damage; cure 2 consecutive saves.`,
        },
      ],
    },

    spider: {
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
          dc: 11 + actor.system.abilities.con.mod,
          type: "fort",
          description: `save Fort DC ${
            11 + actor.system.abilities.con.mod
          }; frequency 1/round for 2 rounds; effect 1d2 Str; cure 1 save.`,
        },
      ],
    },
  };

  async function swarmShape(form, template, energy) {
    const formData = forms[form];
    const templateData = templates[template];
    const sizeData = changes[formData.size];
    const changeData = { ...formData, ...templateData, ...sizeData };
    const buffChanges = [];
    changeData.changes.forEach((element) => {
      buffChanges.push(element);
    });

    let itemsToEmbed = [];
    let buff = actor.collections.items.find(
      (o) => o.type === "buff" && o.name === source,
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

      buffData.name = source;
      buffData.type = "buff";
      buffData.img = "systems/pf1/icons/spells/wild-jade-3.jpg";

      itemsToEmbed.push(buffData);
    }

    let durationData = {
      value: actor.system.attributes.hd.total.toString(),
      units: "hour",
    };

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

    await actor.createEmbeddedDocuments("Item", itemsToEmbed);
    buff = actor.collections.items.find(
      (o) => o.type === "buff" && o.name === source,
    );
    let buffUpdate = [
      {
        _id: buff.id,
        "system.duration": durationData,
        "system.changes": buffChanges,
        "system.active": true,
      },
    ];

    // add effects to swarmattack
    let attack = actor.collections.items.find(
      (o) => o.type === "attack" && o.name === "Swarm",
    );
    let tempAttack = duplicate(attack.system.actions);

    console.log(attack);
    console.log(tempAttack[0]);
    let attackSpecial;
    let attackSave;
    if (!!changeData.sp) {
      changeData.sp.forEach((element) => {
        if (!element.dc) {
          tempAttack[0].attackNotes = element.description;
        } else {
          tempAttack[0].save = element;
        }
      });
    }
    let attackUpdate = [
      {
        _id: attack.id,
        "system.actions": tempAttack,
      },
    ];

    let senseObject = {
      dv: 0,
      ts: 0,
      bs: 0,
      bse: 0,
      ll: { enabled: false, multiplier: { dim: 2, bright: 2 } },
      sid: false,
      tr: false,
      si: false,
      sc: false,
      custom: "",
    };
    let newSenses = { ...senseObject, ...changeData.senses };

    if (!!changeData.template.eres) {
      let newEres = "";
      let elementHandled = false;
      changeData.template.eres.forEach((element) => {
        if (energy == element.type) {
          element.amount += 5;
          elementHandled = true;
        }
        newEres += `${element.type} ${element.amount} `;
      });
      if (!elementHandled) {
        newEres += `${energy} 10 `;
      }
      newEres = newEres.trim();
      await actor.update(mergeObject({ "system.traits.eres": newEres }));
    }

    if (!!changeData.template.dr) {
      let newDr = "";
      changeData.template.dr.forEach((element) => {
        newDr += `${element.amount}/${element.type}`;
      });
      await actor.update(mergeObject({ "system.traits.dr": newDr }));
    }

    if (!!changeData.di) {
      let newDi = "";
      changeData.di.forEach((element) => {
        newDi += element + " ";
      });
      newDi = newDi.trim();
      await actor.update(mergeObject({ "system.traits.di.custom": newDi }));
    }

    await actor.updateEmbeddedDocuments("Item", attackUpdate);
    await actor.updateEmbeddedDocuments("Item", buffUpdate);
    await actor.update(mergeObject({ "system.traits.size": changeData.size }));
    await actor.update(mergeObject({ "system.traits.senses": newSenses }));
  }

  let inputs = [];
  let buttons = [];

  let templateValue = { type: "select", label: "template" };
  let templateOptions = [];
  for (const template in templates) {
    let value = {
      html: template,
      value: { template: template },
    };
    templateOptions.push(value);
  }
  templateValue.options = templateOptions;
  inputs.push(templateValue);

  let energizedValue = { type: "select", label: "element" };
  let energizedOptions = [];
  energized.forEach(function (element) {
    let value = {
      html: element,
      value: { element: element },
    };
    energizedOptions.push(value);
  });
  energizedValue.options = energizedOptions;
  inputs.push(energizedValue);

  for (const form in forms) {
    let value = {};
    value = {
      label: form,
      value: form,
    };
    buttons.push(value);
  }

  let iselda = {
    label: "Iselda",
    value: "iselda",
  };
  buttons.push(iselda);

  let formData = {};
  formData.inputs = inputs;
  formData.buttons = buttons;
  if (!!formData) {
    const choice = await warpgate.menu(formData);
    const form = choice.buttons;
    const template = choice.inputs[0].template;
    const element = choice.inputs[1].element;
    swarmShape(form, template, element);
  }
}
