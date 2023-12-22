import * as OBC from 'openbim-components'
import * as WEBIFC from 'web-ifc'
import { FragmentsGroup } from 'bim-fragment';

type QtoResult = { [setName: string]: { [qtoName: string]: number } }

export class SimpleQTO extends OBC.Component<QtoResult> implements OBC.UI, OBC.Disposable {
    enabled: boolean = true
    static uuid: string = "12ba9933-111b-4628-af87-af22c9c7ba14"
    private _components: OBC.Components

    private _qtoResult: QtoResult = {}

    uiElement = new OBC.UIElement<{
        activationBtn: OBC.Button,
        qtoList: OBC.FloatingWindow
    }>()

    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        this.setUI()
        components.tools.add(SimpleQTO.uuid, this)


    }
    async setup() {
        const fragmentHighlither = await this._components.tools.get(OBC.FragmentHighlighter)
        fragmentHighlither.events.select.onHighlight.add((fragmentMap) => {
            //this.sumQuantities(fragmentMap)
            this.sumQuantitiesV2(fragmentMap)
        })
        fragmentHighlither.events.select.onClear.add(() => {
            this.resetQto()
        })
    }
    async resetQto() {
        this._qtoResult = {}
    }


    private setUI() {
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "functions"

        const qtoList = new OBC.FloatingWindow(this._components)
        qtoList.title = "Quantification"

        qtoList.visible = false
        activationBtn.onClick.add(() => {
            activationBtn.active = !activationBtn.active
            qtoList.visible = activationBtn.active
        })
        this.uiElement.set({ activationBtn, qtoList })
    }
    //setID: id del propertySet
    //relatedId[]: ids de los objetos que tienen ese property set
    async sumQuantities(fragmentIDMap: OBC.FragmentIdMap) {
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager)

        for (const fragmentID in fragmentIDMap) {

            const fragment = fragmentManager.list[fragmentID]
            const model = fragment.mesh.parent
            if (!(model instanceof FragmentsGroup && model.properties)) { continue }
            const properties = model.properties
            OBC.IfcPropertiesUtils.getRelationMap(
                properties,
                WEBIFC.IFCRELDEFINESBYPROPERTIES,
                (setID, relatedID) => {
                    const set = properties[setID]
                    const expressIDs = fragmentIDMap[fragmentID]
                    //const workingID = relatedID.filter((id) => {return expressIDs.has(id.toString())} )
                    const workingID = relatedID.filter(id => expressIDs.has(id.toString()))
                    const { name: setName } = OBC.IfcPropertiesUtils.getEntityName(properties, setID)
                    if (set.type != WEBIFC.IFCELEMENTQUANTITY || workingID.length === 0 || !setName) { return }
                    if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
                    OBC.IfcPropertiesUtils.getQsetQuantities(
                        properties,
                        setID,
                        (qtoID) => {

                            const { name: qtoName } = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                            const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
                            if (qtoName === null || value === null) { return }
                            if (!(qtoName in this._qtoResult[setName])) {
                                this._qtoResult[setName][qtoName] = 0
                                this._qtoResult[setName][qtoName] += value

                            }
                        })
                }
            )

        }

    }
    async sumQuantitiesV2(fragmentIDMap: OBC.FragmentIdMap) {
        const propertiesProcessor = await this._components.tools.get(OBC.IfcPropertiesProcessor)
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
        for (const fragmentID in fragmentIDMap) {
            const fragment = fragmentManager.list[fragmentID]
            const model = fragment.mesh.parent
            if (!(model instanceof FragmentsGroup && model.properties)) { continue }
            const properties = model.properties
            const modelIndexMap = propertiesProcessor.get()[model.uuid]
            if (!modelIndexMap) { continue }
            const expressIDs = fragmentIDMap[fragmentID]//expressId seleccionados
            for (const expressId of expressIDs) {
                const entityMap = modelIndexMap[Number(expressId)]
                if (!entityMap) { continue }

                for (const setId of entityMap) {
                    const entity = properties[setId]
                    const { name: setName } = OBC.IfcPropertiesUtils.getEntityName(properties, setId)
                    if (!(entity.type === WEBIFC.IFCELEMENTQUANTITY && setName)) { continue }
                    if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
                    OBC.IfcPropertiesUtils.getQsetQuantities(
                        properties,
                        setId,
                        (qtoID) => {

                            const { name: qtoName } = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                            const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
                            if (qtoName === null || value === null) { return }
                            if (!(qtoName in this._qtoResult[setName])) {
                                this._qtoResult[setName][qtoName] = 0
                                this._qtoResult[setName][qtoName] += value

                            }
                        })


                }



            }

            console.log(this._qtoResult)
        }

    }







    get(): QtoResult {
        this.resetQto()
        return this._qtoResult
    }

    async dispose() {

    };


}