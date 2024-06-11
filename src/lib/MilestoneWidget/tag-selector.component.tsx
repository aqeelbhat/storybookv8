import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle, Input } from 'reactstrap'
import { ArrowLeft, ChevronRight, PlusCircle, Settings } from  'react-feather'
import style from './tag-selector.module.scss'
import Search from './components/search/Search'

export interface Tag {
    id: string
    label: string
    isSelected?: boolean
    data?: any
}

export interface TagCategory {
    id: string
    label: string
    tags: Array<Tag>
    hasSetting?: boolean
    hasCreateNewTagOption?: boolean
}

const CTags: Array<Tag> = [
    { id: 'Custom tag 01', label: 'Custom tag 01', isSelected: false },
    { id: 'Custom tag 02', label: 'Custom tag 02', isSelected: true },
    { id: 'Custom tag 03', label: 'Custom tag 03', isSelected: false },
    { id: 'Custom tag 04', label: 'Custom tag 04', isSelected: true },
    { id: 'Custom tag 05', label: 'Custom tag 05', isSelected: false },
    { id: 'Custom tag 06', label: 'Custom tag 06', isSelected: false }
]

const TTags: Array<Tag> = [
    { id: 'Team tag 01', label: 'Team tag 01', isSelected: true },
    { id: 'Team tag 02', label: 'Team tag 02', isSelected: false },
    { id: 'Team tag 03', label: 'Team tag 03', isSelected: false },
    { id: 'Team tag 04', label: 'Team tag 04', isSelected: false },
    { id: 'Team tag 05', label: 'Team tag 05', isSelected: true },
    { id: 'Team tag 06', label: 'Team tag 06', isSelected: false }
]

const MTags: Array<Tag> = [
    { id: 'Measure tag 01', label: 'Measure tag 01', isSelected: false },
    { id: 'Measure tag 02', label: 'Measure tag 02', isSelected: false },
    { id: 'Measure tag 03', label: 'Measure tag 03', isSelected: false },
    { id: 'Measure tag 04', label: 'Measure tag 04', isSelected: true },
    { id: 'Measure tag 05', label: 'Measure tag 05', isSelected: false },
    { id: 'Measure tag 06', label: 'Measure tag 06', isSelected: true }
]

export const DATA: Array<TagCategory> = [
    {
        id: 'customTag',
        label: 'Custom tags',
        tags: CTags,
        hasSetting: true,
        hasCreateNewTagOption: true
    },
    {
        id: 'teams',
        label: 'Teams',
        tags: TTags
    },
    {
        id: 'measures',
        label: 'Measures',
        tags: MTags
    }
]

function sortTagListWithSelectedCompareFun (tagA: Tag, tagB: Tag): number {
    return tagB.isSelected ? 1 : -1
}

export function areObjectArraysSame(arrayA: any[], arrayB: any[], compareKey: any): boolean {
    if (arrayA.length === arrayB.length) {
      if (arrayB.length === 0) {
        return true
      } else {
        // find all [compareKey] in arrayA
        const arrayACompareKeys = {}
        arrayA.forEach(value => {
            arrayACompareKeys[value[compareKey]] = true
        })
  
        // check if there is a [compareKey] in arrayB, which was not in arrayA
        const difference = arrayB.some(value => {
          return !(arrayACompareKeys[value[compareKey]])
        })
  
        return !difference
      }
    } else {
      return false
    }
}

function isCategoryHasAtleastSingleSelectedTag (tags: Array<Tag>): boolean {
    return tags.some(tag => tag.isSelected)
}

export function TagSelector (props: {
    tagCategories: Array<TagCategory>
    toggleElement?: React.ReactElement
    dropDownClassName?: string
    dropDownToggleClassName?: string
    onToggleElementClick?: (isShow: boolean) => void
    onTagClick?: (categoryId: string, tag: Tag) => void
    onTagSearch?: (categoryId: string, searchText: string) => void
    onCreateNewTag?: (categoryId: string , tagString: string) => void
}) {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [tagCategories, setTagCategories] = useState<Array<TagCategory>>([])
    // There are primitively two views, 1: Category list view 2: Category list inner view
    const [selectedCategory, setSelectedCategory] = useState<TagCategory | null>(null)
    const [tagListForCategoryView, setTagListForCategoryView] = useState<Array<TagCategory>>([])
    const [tagList, setTagList] = useState<Array<Tag>>([])

    const [searchString, setSearchString] = useState<string>('')
    const [createTagString, setCreateTagString] = useState<string>('')

    useEffect(() => {
        if (Array.isArray(props.tagCategories)) {
            setTagCategories(props.tagCategories)

            props.tagCategories.forEach((category: TagCategory) => {
                if (selectedCategory?.id === category.id) {
                    // Apply sort if list changes or else list ordering should remain the same
                    // Scenario 1: searching changes the list 
                    // Scenatio 2: onTagClick operation only updates the isSelected flag for tag and doesn't change the list

                    if (!areObjectArraysSame(tagList, category.tags, 'id')) {
                        setTagList(category.tags.sort(sortTagListWithSelectedCompareFun))
                    }
                }
            })
        }
    }, [props.tagCategories])

    useEffect(() => {
        if (selectedCategory) {
            setTagList(selectedCategory.tags.sort(sortTagListWithSelectedCompareFun))
        }
    }, [selectedCategory])

    useEffect(() => {
        if (selectedCategory) {
            const tagListForCategoryView: Array<TagCategory> = []
            props.tagCategories.forEach((tagCategory: TagCategory) => {
                if (isCategoryHasAtleastSingleSelectedTag(tagCategory.tags)) {
                    const _tagCategory: TagCategory = { ...tagCategory, tags: tagCategory.tags.filter(tag => tag.isSelected) }
                    tagListForCategoryView.push(_tagCategory)
                }
            })
    
            setTagListForCategoryView(tagListForCategoryView)
        }
    }, [props.tagCategories, selectedCategory])

    useEffect(() => {
        if (isShow) {
            const tagListForCategoryView: Array<TagCategory> = []
            props.tagCategories.forEach((tagCategory: TagCategory) => {
                if (isCategoryHasAtleastSingleSelectedTag(tagCategory.tags)) {
                    const _tagCategory: TagCategory = { ...tagCategory, tags: tagCategory.tags.filter(tag => tag.isSelected) }
                    tagListForCategoryView.push(_tagCategory)
                }
            })

            setTagListForCategoryView(tagListForCategoryView)
        }
    }, [isShow])

    function triggerSearchTextChange (selectedCategory: TagCategory, searchString: string) {
        if (selectedCategory && typeof props.onTagSearch === 'function') {
            props.onTagSearch(selectedCategory.id, searchString)
        }
    }

    function isCustomTagAlreadyExists(): boolean {
        const customTagExists = selectedCategory?.tags.find(item => item.label.toLowerCase() === searchString.toLowerCase().trim())
        return !!customTagExists
    }

    useEffect(() => {
        selectedCategory && triggerSearchTextChange(selectedCategory, searchString)
        if (searchString.length > 2 && !isCustomTagAlreadyExists()) {
            setCreateTagString(searchString)
        } else {
            setCreateTagString('')
        }
    }, [searchString])

    function triggerOnTagClick (categoryId: string, tag: Tag) {
        if (props.onTagClick) {
            props.onTagClick(categoryId, tag)
        }
    }

    function triggerOnCreateNewTag (categoryId: string) {
        setCreateTagString('')
        if (props.onCreateNewTag) {
            props.onCreateNewTag(categoryId, createTagString)
        }
    }

    function mapValueWithSelectedId (id: string, tag: Tag): Tag {
        return id === tag.id ? {...tag, isSelected: !tag.isSelected} : tag
    }

    function onTagItemValueChange (categoryId: string, tag: Tag) {
        triggerOnTagClick(categoryId, { ...tag, isSelected: !tag.isSelected })
        
        setTagList(tagList.map(tagElem => mapValueWithSelectedId(tag.id, tagElem)))
        setTagListForCategoryView(tagListForCategoryView.map(category => {
            category.tags = category.tags.map(tagElem => mapValueWithSelectedId(tag.id, tagElem))

            return category
        }))
    }

    function onToggle () {
        setIsShow(!isShow)
        if (props.onToggleElementClick) {
            props.onToggleElementClick(!isShow)
        }
        if (isShow) {
            selectedCategory && triggerSearchTextChange(selectedCategory, '')
            setSearchString('')
            setSelectedCategory(null)
        }
    }

    function onGotoCategoryList () {
        selectedCategory && triggerSearchTextChange(selectedCategory, '')
        setSearchString('')
        setSelectedCategory(null)
    }

    function getCategoryListStateJsx (): React.ReactElement {
        return <div className={`${ tagListForCategoryView.length === 0 ? style.dropdownMenuContainerCategory : style.dropdownMenuContainerCategoryFullHeight}`}>
            { tagListForCategoryView.length > 0 && <div className={style.dropdownMenuContainerCategoryTagList}>
                { tagListForCategoryView.map((category: TagCategory, index) => <div key={category.id}>
                    <header className={style.dropdownMenuHeader}>{ category.label }</header>
                    <ul className={style.dropdownMenuTagItemContainer} >
                        { category.tags.map((tag: Tag, index) => <li className={style.dropdownMenuTagItem} key={index} onClick={() => onTagItemValueChange(category.id, tag)}>
                            <Input className={style.dropdownMenuTagItemCheckbox} type='checkbox' checked={tag.isSelected} readOnly />
                            <label className={style.dropdownMenuTagItemLabel}>{tag.label}</label>
                        </li>) }
                    </ul>
                </div>) }
            </div> }
            <div>
                <header className={style.dropdownMenuHeader}>Add tags</header>
                { tagCategories.map((category: TagCategory, index) => <div className={style.dropdownMenuItem} key={index} onClick={() => setSelectedCategory(category)}>
                    <div className={style.dropdownMenuItemPaneLeft}>
                        <span className={style.dropdownMenuItemText}>{category.label}</span>
                    </div>
                    <ChevronRight size={18} color='#0B4D7D'/>
                </div>) }
            </div>
        </div>
    }

    function getTagListStateJsx (): React.ReactElement {
        return <>{ selectedCategory && <div className={style.dropdownMenuContainerTags}>
            <header className={style.dropdownMenuHeader}>
                <ArrowLeft size={18} color='#0B4D7D' onClick={onGotoCategoryList} />
                <span className={style.dropdownMenuHeaderTextBold}>{selectedCategory.label}</span>
                { selectedCategory.hasSetting && <Settings size={18} color='#0B4D7D' /> }
            </header>
            <div className={style.dropdownMenuSearch}>
                <Search placeholder="Search by name" boxed={false} keyword={searchString} onInputChange={setSearchString}/>
            </div>
            <ul className={style.dropdownMenuTagItemContainer}>
                { tagList.map((tag: Tag, index) => <li className={style.dropdownMenuTagItem} key={index} onClick={() => onTagItemValueChange(selectedCategory.id, tag)} >
                    <Input className={style.dropdownMenuTagItemCheckbox} type='checkbox' checked={tag.isSelected} readOnly />
                    <label className={style.dropdownMenuTagItemLabel}>{tag.label}</label>
                </li>) }
            </ul>
            { selectedCategory.hasCreateNewTagOption && createTagString && <div className={style.dropdownMenuCreateTagContainer} onClick={() => triggerOnCreateNewTag(selectedCategory.id)}>
                <PlusCircle size={18} color='#0B4D7D' />
                <div className={style.dropdownMenuCreateTagTextContainer}>
                    <span className={style.dropdownMenuCreateTagTextReg}>Create </span>
                    <span className={style.dropdownMenuCreateTagTextBold}>'{createTagString}'</span>
                    <span className={style.dropdownMenuCreateTagTextReg}> as a tag</span>
                </div>
            </div> }
        </div> }</>
    }

    return <div className={style.container}>
        <Dropdown toggle={onToggle} isOpen={isShow} className={props.dropDownClassName || ''}>
            <DropdownToggle data-toggle="dropdown" tag="div" className={props.dropDownToggleClassName || ''}>{props.toggleElement}</DropdownToggle>
            <DropdownMenu className={style.dropdownMenu}>
                { !selectedCategory ? getCategoryListStateJsx() : getTagListStateJsx() }
            </DropdownMenu>
        </Dropdown>
    </div>
}