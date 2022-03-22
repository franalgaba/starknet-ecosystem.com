import {Flex, Stack, Text} from "@chakra-ui/layout";
import { Tag as ChakraTag } from "@chakra-ui/react";
import {useRef, useState} from "react";

import type { Tag } from "../../../data/tag";
import { useTranslate } from "../../context/TranslateProvider";

interface TagMenuProps {
  tags: Tag[];
  initialValue: Tag;
  onChange: (tag: Tag) => void;
}
function TagMenu({ tags, initialValue, onChange }: TagMenuProps) {
    const targetRef = useRef<any>();
  const { t } = useTranslate();
  const [selectedValue, setSelectedValue] = useState<Tag>(initialValue);

  const tagClicked = (newTag: Tag) => {
    setSelectedValue(newTag);
    onChange(newTag);
  };
console.log(targetRef.current.offsetHeight);
  return (
    <Flex ref={targetRef} align="center">
      <Stack
          isInline
          direction="row"
          spacing={4}
          wrap="wrap"
          shouldWrapChildren
          justify="center"
      >
        {tags.map((tag: Tag) => (
            <ChakraTag
                my={1}
                size="lg"
                key={tag.value}
                variant="solid"
                cursor="pointer"
                onClick={() => tagClicked(tag)}
                bg={selectedValue.value === tag.value ? "brand.900" : "whiteAlpha"}
                border="1px solid"
                borderColor={
                  selectedValue.value === tag.value ? "transparent" : "whiteAlpha.300"
                }
                _hover={{
                  background:
                      selectedValue.value === tag.value
                          ? "brand.900"
                          : "whiteAlpha.100",
                }}
            >
              {t.tags[tag.value] || tag.label}
            </ChakraTag>
        ))}
      </Stack>
      <Text>
        more
      </Text>
    </Flex>
  );
}

export default TagMenu;
