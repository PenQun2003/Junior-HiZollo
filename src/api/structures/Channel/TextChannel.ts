import { GuildTextChannel } from "..";
import { ChannelType } from "../../types/types";

export class TextChannel extends GuildTextChannel<ChannelType.GuildText> {}