/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IUserDataSyncUtilService } from 'vs/platform/userDataSync/common/userDataSync';
import { IStringDictionary } from 'vs/base/common/collections';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { FormattingOptions } from 'vs/base/common/jsonFormatter';
import { URI } from 'vs/base/common/uri';
import { ITextModelService } from 'vs/editor/common/services/resolverService';

class UserDataSyncUtilService implements IUserDataSyncUtilService {

	_serviceBrand: undefined;

	constructor(
		@IKeybindingService private readonly keybindingsService: IKeybindingService,
		@ITextModelService private readonly textModelService: ITextModelService,
	) { }

	public async resolveUserBindings(userBindings: string[]): Promise<IStringDictionary<string>> {
		const keys: IStringDictionary<string> = {};
		for (const userbinding of userBindings) {
			keys[userbinding] = this.keybindingsService.resolveUserBinding(userbinding).map(part => part.getUserSettingsLabel()).join(' ');
		}
		return keys;
	}

	async resolveFormattingOptions(resource: URI): Promise<FormattingOptions> {
		const modelReference = await this.textModelService.createModelReference(resource);
		const { insertSpaces, tabSize } = modelReference.object.textEditorModel.getOptions();
		const eol = modelReference.object.textEditorModel.getEOL();
		modelReference.dispose();
		return { eol, insertSpaces, tabSize };
	}
}

registerSingleton(IUserDataSyncUtilService, UserDataSyncUtilService);
