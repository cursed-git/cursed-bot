export type SlashCommandProps = {
  name: string;
  description: string;
};

export class SlashCommand {
  private readonly _name: string;
  private readonly _description: string;

  constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
  }

  public toJSON(): SlashCommandProps {
    return {
      name: this._name,
      description: this._description,
    };
  }

  public static build(params: SlashCommandProps): SlashCommand {
    return new SlashCommand(params.name, params.description);
  }
}
