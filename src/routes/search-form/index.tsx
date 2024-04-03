import { component$, useStyles$ } from "@builder.io/qwik";
import { CheckItem, CheckList, Input, Radio, RadioGroup } from "../../components/base-form";
import styles from './index.scss?inline';
import { SearchForm } from "../../components/base-form/search-form";
import { useSearchParamsProvider } from "../../components/utils/useSearchParams";
import { Select } from "../../components/base-form/select/select";
import { Option } from "../../components/base-form/option/option";

export default component$(() => {
  useStyles$(styles)
  const { params } = useSearchParamsProvider();
  return (
    <section class="control-section">
      <h2>Search Params</h2>
      <SearchForm updateOn="input">
        <Select class="round outline" placeholder="Select multiple movies" name="movies" multi>
          <Option value="lotr">Lord of the Ring</Option>
          <Option value="matrix">Matrix</Option>
          <Option value="star-wars">Star Wars</Option>
        </Select>
        <Select placeholder="Select Justify (bound with radio)" name="justify">
          <Option value="bottom">Bottom</Option>
          <Option value="center">Center</Option>
          <Option value="top">Top</Option>
        </Select>
        <Input name="search" class="outline"/>
        <RadioGroup name="justify" aria-labelledby="radio-group">
          <Radio value="bottom">Bottom</Radio>
          <Radio value="center">Center</Radio>
          <Radio value="top">Top</Radio>
        </RadioGroup>
        <CheckList name="align">
          <legend>Align</legend>
          <CheckItem value="bottom">Bottom</CheckItem>
          <CheckItem value="center">Center</CheckItem>
          <CheckItem value="top">Top</CheckItem>
        </CheckList>
      </SearchForm>
      <p>
        {JSON.stringify(params.value)}
      </p>
    </section>
  )
})